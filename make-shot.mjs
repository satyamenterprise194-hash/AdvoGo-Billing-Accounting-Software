import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'fs';
import { createCanvas, Image } from 'canvas';

const SRC = 'C:/Users/pc/Pictures/Screenshots/Screenshot (1).png';
const OUT = 'app-shot.jpg';

// window bounds (detected via color analysis):
//   top: 48 (blue wallpaper above), bottom: 1012 (taskbar starts ~1015)
//   full width — the app window covers it
const box = { x: 0, y: 48, w: 1920, h: 1012 - 48 };

const src = PNG.sync.read(readFileSync(SRC));
const TARGET_W = 1400;
const TARGET_H = Math.round(box.h * TARGET_W / box.w);

const cv = createCanvas(TARGET_W, TARGET_H);
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const imgData = ctx.createImageData(box.w, box.h);
// copy the crop region (RGBA) from the PNG buffer
for (let y = 0; y < box.h; y++) {
  const srcRow = (y + box.y) * src.width * 4;
  const dstRow = y * box.w * 4;
  for (let x = 0; x < box.w; x++) {
    const si = srcRow + x * 4;
    const di = dstRow + x * 4;
    imgData.data[di] = src.data[si];
    imgData.data[di + 1] = src.data[si + 1];
    imgData.data[di + 2] = src.data[si + 2];
    imgData.data[di + 3] = 255;
  }
}
ctx.putImageData(imgData, 0, 0);
const img = cv.toBuffer('image/jpeg', { quality: 0.9 });
writeFileSync(OUT, img);
console.log('wrote', OUT, (img.length / 1024).toFixed(0) + 'KB', TARGET_W + 'x' + TARGET_H);

// ---- verify the crop: sample key regions ----
const chk = createCanvas(TARGET_W, TARGET_H);
chk.getContext('2d').drawImage(loadImageSync(OUT), 0, 0);
const cctx = chk.getContext('2d');
const px = (x, y) => {
  const d = cctx.getImageData(x, y, 1, 1).data;
  return [d[0], d[1], d[2]];
};
console.log('sidebar (dark navy, expect 36,41,67) :', px(60, Math.floor(TARGET_H / 2)).join(','));
console.log('main content (white, expect ~242)    :', px(Math.floor(TARGET_W / 2), Math.floor(TARGET_H / 2)).join(','));
console.log('top edge (no blue wallpaper, expect W):', px(Math.floor(TARGET_W / 2), 5).join(','));
console.log('bottom edge (no taskbar, expect ~W)  :', px(Math.floor(TARGET_W / 2), TARGET_H - 5).join(','));

function loadImageSync(p) {
  const img = new Image();
  img.src = readFileSync(p);
  return img;
}
