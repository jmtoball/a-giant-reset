const CACHE_SIZE = 1000;
const tileCache = new Map<string, { buffer: Buffer; contentType: string }>();
const cacheOrder: string[] = [];

export async function GET(
  _: Request,
  { params }: { params: Promise<{ z: string; x: string; y: string }> },
) {
  const { z, x, y } = await params;
  const cacheKey = `${z}/${x}/${y}`;

  // Cache hit
  const cached = tileCache.get(cacheKey);
  if (cached) {
    const idx = cacheOrder.indexOf(cacheKey);
    if (idx !== -1) {
      cacheOrder.splice(idx, 1);
      cacheOrder.push(cacheKey);
    }
    return new Response(cached.buffer, {
      status: 200,
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, s-maxage=31536000',
      },
    });
  }

  console.info(`Cache miss for tile ${cacheKey}`);

  // Fetch from downstream
  const url = `https://a.tile.opentopomap.org/${z}/${x}/${y}.png`;
  const resp = await fetch(url);
  if (!resp.ok) {
    return new Response('Tile not found', { status: 404 });
  }
  const buffer = Buffer.from(await resp.arrayBuffer());
  const contentType = resp.headers.get('content-type') || 'image/png';

  // Cache
  tileCache.set(cacheKey, { buffer, contentType });
  cacheOrder.push(cacheKey);
  if (cacheOrder.length > CACHE_SIZE) {
    const oldestKey = cacheOrder.shift();
    if (oldestKey) tileCache.delete(oldestKey);
  }

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, s-maxage=31536000',
    },
  });
}
