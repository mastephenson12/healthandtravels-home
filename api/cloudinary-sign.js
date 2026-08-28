const crypto = require("crypto");

const attempts = new Map();
const ALLOWED_ORIGINS = new Set([
  "https://healthandtravels.com",
  "https://www.healthandtravels.com"
]);

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function rateLimited(req) {
  const ip = clean(req.headers["x-forwarded-for"]?.split(",")[0], 64) || "unknown";
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (attempts.get(ip) || []).filter((time) => now - time < windowMs);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 20;
}

function safeKeyMatch(provided, expected) {
  if (!provided || !expected) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!ALLOWED_ORIGINS.has(clean(req.headers.origin, 200))) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  if (rateLimited(req)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (!safeKeyMatch(req.headers["x-media-key"], process.env.MEDIA_UPLOAD_KEY)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({ error: "Cloudinary environment variables are not configured" });
  }

  const input = req.body && req.body.paramsToSign ? req.body.paramsToSign : {};
  const publicId = clean(input.public_id, 120);
  const tags = clean(input.tags, 300);
  const context = clean(input.context, 1500);

  if (!publicId || !/^[a-z0-9/_-]+$/i.test(publicId)) {
    return res.status(400).json({ error: "Invalid public_id" });
  }

  const now = Math.floor(Date.now() / 1000);
  const params = {
    timestamp: now,
    folder: "health-and-travels/inbox",
    tags: tags ? "ht-upload,inbox," + tags : "ht-upload,inbox",
    public_id: publicId
  };

  if (context) params.context = context;

  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => key + "=" + params[key])
    .join("&");
  const signature = crypto.createHash("sha1").update(signatureBase + apiSecret).digest("hex");

  return res.status(200).json({
    signature,
    timestamp: now,
    cloudName,
    apiKey,
    signedParams: params
  });
};
