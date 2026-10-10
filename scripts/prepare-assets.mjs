import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/assets", { recursive: true });
for (const name of [
  "world-background",
  "rohit-avatar",
  "clinzo-castle",
  "openforms-workshop",
]) {
  let pipeline = sharp(`design/${name}.png`);
  if (name !== "world-background") pipeline = pipeline.trim({ threshold: 15 });
  await pipeline
    .resize({
      width:
        name === "world-background"
          ? 1672
          : name === "rohit-avatar"
            ? 180
            : 640,
      withoutEnlargement: true,
    })
    .webp({ quality: 85, alphaQuality: 100 })
    .toFile(`public/assets/${name}.webp`);
}
await sharp("design/world-background.png")
  .resize(720)
  .webp({ quality: 78 })
  .toFile("public/assets/world-mobile.webp");
console.log(
  "Design sources live in design/; trimmed WebP runtime assets written to public/assets.",
);
