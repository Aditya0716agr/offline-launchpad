import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: any, res: any) {
  try {
    // Fetch all approved startups
    const { data: startups, error } = await supabase
      .from('startups')
      .select('id, name, updated_at')
      .eq('status', 'approved')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching startups for sitemap:', error);
      return res.status(500).json({ error: 'Failed to generate sitemap' });
    }

    // Fetch all categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
      .order('name');

    const baseUrl = 'https://knowfounders.com';
    const currentDate = new Date().toISOString();

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/explore</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/dashboard</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Add startup pages
    if (startups) {
      startups.forEach((startup) => {
        sitemap += `
  <url>
    <loc>${baseUrl}/startup/${startup.id}</loc>
    <lastmod>${new Date(startup.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    }

    // Add category pages
    if (categories) {
      categories.forEach((category) => {
        sitemap += `
  <url>
    <loc>${baseUrl}/explore?category=${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    sitemap += `
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
