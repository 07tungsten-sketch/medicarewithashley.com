import sharp from "sharp";
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";
import { join, basename, extname } from "path";

const PUBLIC = "artifacts/medicare-site/public";
const BACKUP = "artifacts/medicare-site/images-original";

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function kb(bytes) {
  return (bytes / 1024).toFixed(1) + " KB";
}

async function convert(srcPath, destPath, options) {
  const before = statSync(srcPath).size;
  await sharp(srcPath).webp(options).toFile(destPath);
  const after = statSync(destPath).size;
  console.log(`  ${basename(srcPath)} → ${basename(destPath)}: ${kb(before)} → ${kb(after)}`);
}

async function compressJpeg(srcPath, destPath, quality) {
  const before = statSync(srcPath).size;
  await sharp(srcPath).jpeg({ quality, mozjpeg: true }).toFile(destPath);
  const after = statSync(destPath).size;
  console.log(`  ${basename(srcPath)} → ${basename(destPath)}: ${kb(before)} → ${kb(after)}`);
}

async function run() {
  ensureDir(BACKUP);
  ensureDir(join(BACKUP, "carriers"));

  console.log("\n=== Carrier logos ===");
  const carrierSrc = join(PUBLIC, "carriers");
  const carrierBackup = join(BACKUP, "carriers");

  const carrierConversions = [
    { name: "alignment.png",      quality: 85 },
    { name: "blueshield.jpg",     quality: 85 },
    { name: "humana.png",         quality: 85 },
    { name: "imperialhealth.png", quality: 85 },
    { name: "molina.png",         quality: 85 },
    { name: "scan.png",           quality: 85 },
    { name: "uhc.png",            quality: 85 },
    { name: "wellcare.jpg",       quality: 85 },
  ];

  for (const { name, quality } of carrierConversions) {
    const src = join(carrierSrc, name);
    if (!existsSync(src)) { console.log(`  SKIP (not found): ${name}`); continue; }
    const dest = join(carrierSrc, name.replace(/\.(png|jpg|jpeg)$/i, ".webp"));
    copyFileSync(src, join(carrierBackup, name));
    await convert(src, dest, { quality });
  }

  console.log("\n=== Root images ===");

  // ashley-watson.jpg - already have .webp; just back up
  const ashleyJpg = join(PUBLIC, "ashley-watson.jpg");
  if (existsSync(ashleyJpg)) {
    copyFileSync(ashleyJpg, join(BACKUP, "ashley-watson.jpg"));
    console.log(`  ashley-watson.jpg → backed up (webp already exists)`);
  }

  // opengraph.jpg — compress in-place (keep as jpg for social media compatibility)
  const ogSrc = join(PUBLIC, "opengraph.jpg");
  const ogTmp = join(PUBLIC, "opengraph.tmp.jpg");
  if (existsSync(ogSrc)) {
    copyFileSync(ogSrc, join(BACKUP, "opengraph.jpg"));
    await compressJpeg(ogSrc, ogTmp, 75);
    // Replace original with compressed version
    const { renameSync } = await import("fs");
    renameSync(ogTmp, ogSrc);
  }

  // logo-medicare-with-ashley.png - already have .webp; just back up
  const logoPng = join(PUBLIC, "logo-medicare-with-ashley.png");
  if (existsSync(logoPng)) {
    copyFileSync(logoPng, join(BACKUP, "logo-medicare-with-ashley.png"));
    console.log(`  logo-medicare-with-ashley.png → backed up (webp already exists)`);
  }

  console.log("\n=== Done ===\n");
}

run().catch(console.error);
