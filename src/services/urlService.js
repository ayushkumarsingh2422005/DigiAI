import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeUrl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract text content from common content elements
    const content = $('p, h1, h2, h3, h4, h5, h6, article')
      .map((_, element) => $(element).text().trim())
      .get()
      .join('\n\n');
      
    return content;
  } catch (error) {
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
}