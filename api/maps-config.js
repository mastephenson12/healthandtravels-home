export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({error:'Method not allowed'});
  }
  const key = process.env.GOOGLE_MAPS_BROWSER_KEY?.trim();
  if (!key) return response.status(503).json({error:'Interactive maps are not configured'});
  return response.status(200).json({key});
}
