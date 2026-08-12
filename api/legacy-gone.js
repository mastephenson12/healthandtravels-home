export default function handler(request, response) {
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400");
  response.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.status(410).send("Gone");
}
