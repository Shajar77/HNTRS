import fs from 'fs';
import path from 'path';

const bakugoSrc = "src/assets/❍┊❛𝐊𝐀𝐓𝐒𝐔𝐊𝐈 𝐁𝐀𝐊𝐔𝐆𝐎𝐔❜.jpg";
const bakugoDest = "public/anime/bakugo.jpg";

const gokuSrc = "public/images/download (3).jpg";
const gokuDest = "public/anime/news-goku.jpg";

try {
  if (!fs.existsSync('public/anime')) {
    fs.mkdirSync('public/anime', { recursive: true });
  }

  if (fs.existsSync(bakugoSrc)) {
    fs.copyFileSync(bakugoSrc, bakugoDest);
    console.log("Successfully copied Bakugo!");
  } else {
    console.error("Bakugo source not found:", bakugoSrc);
  }

  if (fs.existsSync(gokuSrc)) {
    fs.copyFileSync(gokuSrc, gokuDest);
     console.log("Successfully copied Goku!");
  } else {
    console.error("Goku source not found:", gokuSrc);
  }

} catch (err) {
  console.error(err);
}
