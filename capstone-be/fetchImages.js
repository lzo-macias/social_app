const fs = require("fs");
const path = require("path");
const axios = require("axios");

const UNSPLASH_ACCESS_KEY = "5eGkqslRM_Odz6FvGe4sK4LdS27XqN8d3ClOQe4YtTo";
const BASE_DIR = path.resolve(__dirname, "uploads/seed");

const themes = [
  "Books", "Gaming", "Nature", "Pets", "Cars", "Fashion", "Tech", "Startups",
  "Memes", "Movies", "Travel", "Design", "Crypto", "AI", "Spirituality", "Parenting",
  "Education", "Finance", "Skincare", "Interior Design", "Music", "Hiking",
  "Mental Health", "Art", "Language Learning", "Politics", "News"
];

function toFolderName(name) {
  return name.toLowerCase().replace(/\s/g, "");
}

async function downloadImage(url, filepath) {
  const response = await axios({ url, responseType: "stream" });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function fetchAndSaveImages(query, destFolder, count = 10) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await axios.get(url);
    const results = res.data.results;
  
    for (let i = 0; i < results.length; i++) {
      const img = results[i];
      const imageUrl = img.urls.regular;
      const filename = `image${i + 1}.jpg`;
      const filepath = path.join(destFolder, filename);
  
      try {
        // 📥 Download and save image
        await downloadImage(imageUrl, filepath);
        console.log(`✅ Saved ${query} image: ${filename}`);
  
        // ✍️ Attribution (credit)
        const credit = `Photo by ${img.user.name} on Unsplash: ${img.links.html}`;
        console.log(`📸 Attribution: ${credit}`);
  
        // 💾 Save credit to a text file in the same folder
        const creditPath = path.join(destFolder, `credits.txt`);
        fs.appendFileSync(creditPath, credit + "\n");
      } catch (err) {
        console.error(`❌ Failed to save ${filename}:`, err.message);
      }
    }
  }
  

(async () => {
  for (const theme of themes) {
    const folderName = toFolderName(theme);
    const dir = path.join(BASE_DIR, folderName);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const fileCount = fs.readdirSync(dir).filter(f => f.endsWith(".jpg")).length;
    const numToDownload = Math.max(0, 15 - fileCount);

    if (numToDownload === 0) {
      console.log(`⏭️  Skipping "${theme}" — already has 15 images.`);
      continue;
    }

    console.log(`📸 Fetching ${numToDownload} "${theme}" images...`);
    await fetchAndSaveImages(theme, dir, numToDownload);
  }
})();

