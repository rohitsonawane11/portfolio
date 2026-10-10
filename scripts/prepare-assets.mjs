import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

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

// --- player sprite sheet -----------------------------------------------------
//
// The source sheet is image-generated, so its 16 poses are NOT on a uniform
// grid: the row bands are 287-328px tall, the column bands 212-233px wide, and
// the jump row's figures drift ~35px horizontally. Slicing it with a fixed cell
// size makes the character jitter and change size mid-animation. Instead each
// pose is located by its own alpha bounding box and recomposited onto a uniform
// cell, which is what lets the runtime treat it as an ordinary spritesheet.
//
// Alignment rules:
//   horizontal - every pose is centred on its bounding box
//   vertical   - each row keeps the vertical relationships it was drawn with
//                (the generator got those right), and the row as a whole is
//                shifted so grounded poses share a foot baseline. This removes
//                the inter-row drift without flattening the deliberate crouch,
//                rise and tuck heights in the jump row.

const SHEET = {
  src: "design/rohit-sprite-sheet.png",
  columns: 4,
  rows: 4,
  // Source-space cell, large enough for the widest pose (214px) and the full
  // vertical span from the highest tuck to the lowest run contact (337px).
  cell: { width: 232, height: 348 },
  // Where the body centre and the foot baseline sit inside that cell.
  anchor: { x: 116, y: 337 },
  // Output cell. 232/66 === 348/99, so the aspect ratio survives the resize,
  // and the character lands at ~90px tall — the size the collision box and the
  // platform heights in QuestScene are tuned around.
  out: { width: 66, height: 99 },
  rowNames: ["idle", "run", "jump", "emote"],
};

const ALPHA = 8; // opacity above which a pixel counts as part of the figure
const SPECK = 3; // ignore rows/columns thinner than this: the sheet has strays

/** Contiguous runs of occupied indices, used to find the gutters between poses. */
function bands(counts) {
  const out = [];
  let start = -1;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0 && start < 0) start = i;
    else if (counts[i] === 0 && start >= 0) {
      out.push([start, i - 1]);
      start = -1;
    }
  }
  if (start >= 0) out.push([start, counts.length - 1]);
  return out;
}

const sheet = await sharp(SHEET.src).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width: sheetWidth, height: sheetHeight, channels } = sheet.info;
const opaque = (x, y) =>
  sheet.data[(y * sheetWidth + x) * channels + 3] > ALPHA;

const columnInk = new Array(sheetWidth).fill(0);
const rowInk = new Array(sheetHeight).fill(0);
for (let y = 0; y < sheetHeight; y++) {
  for (let x = 0; x < sheetWidth; x++) {
    if (opaque(x, y)) {
      columnInk[x]++;
      rowInk[y]++;
    }
  }
}
const rowBands = bands(rowInk).filter(([a, b]) => b - a >= SPECK);
const columnBands = bands(columnInk).filter(([a, b]) => b - a >= SPECK);
if (rowBands.length !== SHEET.rows || columnBands.length !== SHEET.columns) {
  throw new Error(
    `Expected a ${SHEET.columns}x${SHEET.rows} sheet, found ${columnBands.length} columns and ${rowBands.length} rows. ` +
      `Re-check design/rohit-sprite-sheet.png: poses must be separated by fully transparent gutters.`,
  );
}

/** Bounding box of one pose, ignoring the stray specks the sheet carries. */
function poseBounds([x0, x1], [y0, y1]) {
  const columns = new Map();
  const rows = new Map();
  const top = Math.max(0, y0 - 8);
  const bottom = Math.min(sheetHeight - 1, y1 + 8);
  const left = Math.max(0, x0 - 8);
  const right = Math.min(sheetWidth - 1, x1 + 8);
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (!opaque(x, y)) continue;
      columns.set(x, (columns.get(x) ?? 0) + 1);
      rows.set(y, (rows.get(y) ?? 0) + 1);
    }
  }
  const solid = (map) =>
    [...map.entries()].filter(([, count]) => count >= SPECK).map(([i]) => i);
  const xs = solid(columns);
  const ys = solid(rows);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    left: minX,
    top: minY,
    width: Math.max(...xs) - minX + 1,
    height: Math.max(...ys) - minY + 1,
    bottom: Math.max(...ys),
  };
}

const poses = rowBands.map((rowBand) =>
  columnBands.map((columnBand) => poseBounds(columnBand, rowBand)),
);

const tiles = [];
poses.forEach((row, rowIndex) => {
  // Grounded poses share the row's most common foot line; where every pose sits
  // at a different height (the jump row) the lowest one is the grounded one.
  const bottoms = row.map((pose) => pose.bottom);
  const tally = new Map();
  for (const bottom of bottoms) tally.set(bottom, (tally.get(bottom) ?? 0) + 1);
  const repeated = [...tally.entries()].filter(([, count]) => count > 1);
  const baseline = repeated.length
    ? Math.max(...repeated.map(([bottom]) => bottom))
    : Math.max(...bottoms);

  row.forEach((pose, columnIndex) => {
    const left = SHEET.anchor.x - Math.round(pose.width / 2);
    const top = SHEET.anchor.y + (pose.bottom - baseline) - pose.height + 1;
    if (
      left < 0 ||
      top < 0 ||
      left + pose.width > SHEET.cell.width ||
      top + pose.height > SHEET.cell.height
    ) {
      throw new Error(
        `Pose ${SHEET.rowNames[rowIndex]}${columnIndex} does not fit the ${SHEET.cell.width}x${SHEET.cell.height} cell. Widen SHEET.cell.`,
      );
    }
    tiles.push({ pose, left, top, rowIndex, columnIndex });
  });
});

const cells = await Promise.all(
  tiles.map(async ({ pose, left, top }) =>
    sharp({
      create: {
        width: SHEET.cell.width,
        height: SHEET.cell.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: await sharp(SHEET.src)
            .extract({
              left: pose.left,
              top: pose.top,
              width: pose.width,
              height: pose.height,
            })
            .png()
            .toBuffer(),
          left,
          top,
        },
      ])
      .png()
      .toBuffer(),
  ),
);

// Composite and resize must be separate pipelines: sharp always resizes its
// input before applying overlays, so chaining them would shrink the canvas and
// then paste the full-size cells on top of it.
const fullSize = await sharp({
  create: {
    width: SHEET.cell.width * SHEET.columns,
    height: SHEET.cell.height * SHEET.rows,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(
    cells.map((input, index) => ({
      input,
      left: (index % SHEET.columns) * SHEET.cell.width,
      top: Math.floor(index / SHEET.columns) * SHEET.cell.height,
    })),
  )
  .png()
  .toBuffer();

await sharp(fullSize)
  .resize({
    width: SHEET.out.width * SHEET.columns,
    height: SHEET.out.height * SHEET.rows,
    kernel: "lanczos3",
    fit: "fill",
  })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile("public/assets/rohit-sprite.webp");

// The runtime needs the frame geometry, and deriving it from the texture would
// silently follow any future change to the source art. Emit it instead.
const scale = SHEET.out.height / SHEET.cell.height;
const idleHeight = Math.round(poses[0][0].height * scale);
const frameIndex = Object.fromEntries(
  SHEET.rowNames.map((name, row) => [
    name,
    [0, 1, 2, 3].map((column) => row * SHEET.columns + column),
  ]),
);
await writeFile(
  "src/lib/player-sprite.ts",
  `// Generated by scripts/prepare-assets.mjs. Do not edit by hand.
// Run \`pnpm assets\` after changing design/rohit-sprite-sheet.png.

export const playerSprite = {
  key: "player",
  url: "/assets/rohit-sprite.webp",
  frameWidth: ${SHEET.out.width},
  frameHeight: ${SHEET.out.height},
  /** Height of the standing character inside a frame, in frame pixels. */
  characterHeight: ${idleHeight},
  /** Y of the shared foot baseline inside a frame, in frame pixels. */
  baselineY: ${Math.round(SHEET.anchor.y * scale)},
  frames: ${JSON.stringify(frameIndex)},
} as const;
`,
);

console.log(
  "Design sources live in design/; trimmed WebP runtime assets written to public/assets.",
);
console.log(
  `Player sheet normalised to ${SHEET.out.width}x${SHEET.out.height} frames (character ${idleHeight}px tall).`,
);
