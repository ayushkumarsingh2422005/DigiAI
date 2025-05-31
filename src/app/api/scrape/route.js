import { scrapeUrl } from '@/services/urlService';

export async function POST(request) {
  try {
    const { url } = await request.json();
    const content = await scrapeUrl(url);
    return Response.json({ content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}