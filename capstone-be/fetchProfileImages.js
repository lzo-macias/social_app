const fs = require("fs");
const path = require("path");
const axios = require("axios");

const UNSPLASH_ACCESS_KEY = "5eGkqslRM_Odz6FvGe4sK4LdS27XqN8d3ClOQe4YtTo";
const PROFILE_DIR = path.resolve(__dirname, "uploads/userprofilepicturesseed");
const TARGET_COUNT = 100;

async function downloadImage(url, filepath) {
  const response = await axios({ url, responseType: "stream" });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function fetchProfileImages(target = TARGET_COUNT) {
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

  let existing = fs.readdirSync(PROFILE_DIR).filter(f => f.endsWith(".jpg")).length;
  let toDownload = Math.max(0, target - existing);
  let page = 1;
  let nextImageIndex = existing + 1;

  while (toDownload > 0) {
    const fetchCount = Math.min(toDownload, 30); // Max 30 per page
    const url = `https://api.unsplash.com/search/photos?query=3D+avatar&per_page=${fetchCount}&page=${page}&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await axios.get(url);
    const results = res.data.results;

    if (!results.length) break; // Stop if nothing else found

    for (const img of results) {
      if (toDownload <= 0) break;

      const imageUrl = img.urls.regular;
      const filename = `profile${nextImageIndex}.jpg`;
      const filepath = path.join(PROFILE_DIR, filename);
      const credit = `Photo by ${img.user.name} on Unsplash: ${img.links.html}`;

      try {
        await downloadImage(imageUrl, filepath);
        fs.appendFileSync(path.join(PROFILE_DIR, `credits.txt`), credit + "\n");
        console.log(`✅ Saved profile image: ${filename}`);
        toDownload--;
        nextImageIndex++;
      } catch (err) {
        console.error(`❌ Failed to save ${filename}:`, err.message);
      }
    }

    page++;
  }

  console.log(`🎉 Done! Total profile images: ${nextImageIndex - 1}`);
}

fetchProfileImages();
