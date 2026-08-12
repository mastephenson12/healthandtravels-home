import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputPath = path.resolve('data/cloudinary-images.json');
const prefix = (process.env.CLOUDINARY_FOLDER || 'health-and-travels').replace(/^\/+|\/+$/g, '');
function credentials() {
  if (process.env.CLOUDINARY_URL) {
    const url = new URL(process.env.CLOUDINARY_URL);
    return { cloudName: url.hostname, apiKey: decodeURIComponent(url.username), apiSecret: decodeURIComponent(url.password) };
  }
  return { cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, apiSecret: process.env.CLOUDINARY_API_SECRET };
}
function orientation(width, height) {
  if (!width || !height) return 'unknown';
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}
function normalizeContext(context) { return context?.custom || context || {}; }
function catalogAsset(resource) {
  const context = normalizeContext(resource.context);
  const tags = Array.isArray(resource.tags) ? [...resource.tags].sort() : [];
  const usage = String(context.usage || context.best_use || '').split(',').map((v) => v.trim()).filter(Boolean).sort();
  const asset = {
    publicId: resource.public_id, displayName: resource.display_name || resource.public_id.split('/').at(-1),
    assetFolder: resource.asset_folder || '', format: resource.format || '', width: resource.width || null,
    height: resource.height || null, bytes: resource.bytes || null,
    aspectRatio: resource.width && resource.height ? Number((resource.width / resource.height).toFixed(3)) : null,
    orientation: orientation(resource.width, resource.height), secureUrl: resource.secure_url || '',
    uploadedAt: resource.created_at || '', tags, alt: context.alt || '', caption: context.caption || '',
    location: context.location || '', credit: context.credit || '', rights: context.rights || '', usage
  };
  const warnings = [];
  if (!asset.alt) warnings.push('missing-alt');
  if (!asset.location) warnings.push('missing-location');
  if (!asset.credit) warnings.push('missing-credit');
  if (!asset.rights) warnings.push('missing-rights');
  if (!asset.tags.length) warnings.push('missing-tags');
  if (!asset.usage.length) warnings.push('missing-usage');
  if (/\\s|_|img-|dsc-|photo-?\\d/i.test(asset.publicId)) warnings.push('weak-public-id');
  return { ...asset, warnings };
}
const { cloudName, apiKey, apiSecret } = credentials();
if (!cloudName || !apiKey || !apiSecret) throw new Error('Set CLOUDINARY_URL or the three CLOUDINARY credential variables.');
const resources = [];
let nextCursor = '';
do {
  const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`);
  url.searchParams.set('prefix', prefix); url.searchParams.set('max_results', '500');
  url.searchParams.set('tags', 'true'); url.searchParams.set('context', 'true');
  if (nextCursor) url.searchParams.set('next_cursor', nextCursor);
  const response = await fetch(url, { headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` } });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.error?.message || `Cloudinary returned ${response.status}`);
  resources.push(...(result.resources || [])); nextCursor = result.next_cursor || '';
} while (nextCursor);
const assets = resources.map(catalogAsset).sort((a, b) => a.publicId.localeCompare(b.publicId));
const warningCounts = assets.reduce((counts, asset) => {
  for (const warning of asset.warnings) counts[warning] = (counts[warning] || 0) + 1;
  return counts;
}, {});
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ schemaVersion: 1, cloudinaryPrefix: prefix, assetCount: assets.length, warningCounts, assets }, null, 2)}\\n`, 'utf8');
console.log(`Wrote ${assets.length} assets to ${path.relative(process.cwd(), outputPath)}.`);
if (Object.keys(warningCounts).length) console.log('Catalog warnings:', warningCounts);
