const crypto = require("crypto");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.MEDIA_UPLOAD_KEY || req.headers["x-media-key"] !== process.env.MEDIA_UPLOAD_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({ error: "Cloudinary environment variables are not configured" });
  }

  const input = req.body && req.body.paramsToSign ? req.body.paramsToSign : {};
  const allowed = ["timestamp", "folder", "tags", "context", "public_id"];
  const params = {};
  for (const key of allowed) {
    if (input[key] !== undefined && input[key] !== "") params[key] = String(input[key]);
  }

  const now = Math.floor(Date.now() / 1000);
  params.timestamp = now;
  params.folder = "health-and-travels/inbox";
  params.tags = params.tags ? "ht-upload,inbox," + params.tags : "ht-upload,inbox";

  const signatureBase = Object.keys(params).sort().map((key) => key + "=" + params[key]).join("&");
  const signature = crypto.createHash("sha1").update(signatureBase + apiSecret).digest("hex");

  return res.status(200).json({
    signature,
    timestamp: now,
    cloudName,
    apiKey,
    signedParams: params
  });
};