const BASE_URL = "https://watch-neon-zeta.vercel.app";
const PROJECT_ID = "watch-store-7b195";

async function main() {
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`);
  const data = await res.json();
  const docs = data.documents || [];

  const productIds = docs.map(d => d.name.split("/").pop());

  const staticPaths = ["", "contact.html"];
  const today = new Date().toISOString().split("T")[0];

  let urls = staticPaths.map(path => `
  <url>
    <loc>${BASE_URL}/${path}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join("");

  urls += productIds.map(id => `
  <url>
    <loc>${BASE_URL}/product.html?id=${id}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  require("fs").writeFileSync("public/sitemap.xml", xml);
  console.log(`Sitemap generated with ${productIds.length} products.`);
}

main();
