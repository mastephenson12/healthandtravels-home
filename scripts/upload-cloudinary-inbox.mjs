import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const shouldUpload = process.argv.includes('--confirm');
const inboxDirectory = path.resolve('photo-inbox');
const rootFolder = (process.env.CLOUDINARY_FOLDER || 'health-and-travels').replace(/^\/+|\/+$/g, '');
const supportedExtensions = new Set(['.avif', '.heic', '.heif', '.jpg', '.jpeg', '.png', '.webp']);

function credentials() {
  if (process.env.CLOUDINARY_URL) {
    const url = new URL(process.env.CLOUDINARY_URL);
    return { cloudName: url.hostname, apiKey: decodeURIComponent(url.username), apiSecret: decodeURIComponent(url.password) };
  }
  return { cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, apiSecret: process.env.CLOUDINARY_API_SECRET };
}
function slug(value) {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');
}
function sign(params, secret) {
  const value = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${key}=${item}`).join('&');
  return createHash('sha1').update(`${value}${secret}`).digest('hex');
}
async function json(file) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { if (error?.code === 'ENOENT') return {}; throw new Error(`${path.relative(process.cwd(), file)}: ${error.message}`); }
}
async function collect(directory, inherited = {}) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error?.code === 'ENOENT') return []; throw error; }
  const defaults = { ...inherited, ...(await json(path.join(directory, '_defaults.json'))) };
  const images = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) { images.push(...(await collect(fullPath, defaults))); continue; }
    if (!supportedExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const metadata = { ...defaults, ...(await json(`${fullPath}.json`)) };
    const segments = path.relative(inboxDirectory, directory).split(path.sep).filter(Boolean).map(slug).filter(Boolean);
    const cleanName = slug(path.parse(entry.name).name);
    const publicId = [rootFolder, ...segments, cleanName].join('/');
    const tags = ['health-and-travels', 'arizona', ...segments, ...(Array.isArray(metadata.tags) ? metadata.tags : [])]
      .map(slug).filter(Boolean).filter((v, i, all) => all.indexOf(v) === i).sort();
    const usage = Array.isArray(metadata.usage) ? metadata.usage.map(slug).filter(Boolean) : [];
    const context = {
      alt: String(metadata.alt || '').trim(), caption: String(metadata.caption || '').trim(),
      location: String(metadata.location || '').trim(), credit: String(metadata.credit || '').trim(),
      rights: String(metadata.rights || '').trim(), usage: usage.join(',')
    };
    const warnings = Object.entries({ alt: context.alt, location: context.location, credit: context.credit, rights: context.rights, usage: context.usage })
      .filter(([, value]) => !value).map(([key]) => `missing-${key}`);
    images.push({ filePath: fullPath, relativePath: path.relative(process.cwd(), fullPath), publicId,
      assetFolder: [rootFolder, ...segments].join('/'), tags, context, warnings });
  }
  return images;
}
function contextString(context) {
  return Object.entries(context).filter(([, value]) => value).map(([key, value]) => `${key}=${String(value).replace(/[=|]/g, ' ')}`).join('|');
}
const images = await collect(inboxDirectory);
if (!images.length) { console.log('No images found. Add photos under photo-inbox/<location>/ and run again.'); process.exit(0); }
for (const image of images) {
  console.log(`${image.relativePath} -> ${image.publicId}`);
  if (image.warnings.length) console.log(`  Warnings: ${image.warnings.join(', ')}`);
}
if (!shouldUpload) { console.log(`Dry run: ${images.length} images found. Add --confirm to upload.`); process.exit(0); }
const { cloudName, apiKey, apiSecret } = credentials();
if (!cloudName || !apiKey || !apiSecret) throw new Error('Set CLOUDINARY_URL or the three CLOUDINARY credential variables.');
for (const image of images) {
  const timestamp = Math.floor(Date.now() / 1000);
  const context = contextString(image.context);
  const params = { asset_folder: image.assetFolder, overwrite: 'true', public_id: image.publicId, tags: image.tags.join(','), timestamp: String(timestamp) };
  if (context) params.context = context;
  const form = new FormData();
  form.set('file', new Blob([await readFile(image.filePath)]), path.basename(image.filePath));
  form.set('api_key', apiKey);
  for (const [key, value] of Object.entries(params)) form.set(key, value);
  form.set('signature', sign(params, apiSecret));
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
  const result = await response.json();
  if (!response.ok) throw new Error(`${image.relativePath}: ${result?.error?.message || response.statusText}`);
  console.log(`Uploaded ${image.relativePath} -> ${result.public_id}`);
}
console.log(`Uploaded ${images.length} images. Next: npm run cloudinary:catalog`);
