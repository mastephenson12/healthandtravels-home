export default function handler(request, response) {
  response.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400");
  response.setHeader("Location", "https://newsletter.healthandtravels.com/archive");
  response.status(308).end();
}
