// Generates favicon assets from the real ADVO GO logo (logo.svg):
//   favicon.svg (copy), favicon-32.png, apple-touch-icon.png (180), favicon.ico
// Rasterizes the logo geometry in pure JS with 4x supersampling for smooth edges.
import { createRequire } from 'module';
import { writeFileSync, readFileSync } from 'fs';

const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');

// ---------- logo geometry (from logo.svg, viewBox 0 0 64 64) ----------
const RECT = { x: 2, y: 2, w: 60, h: 60, r: 15 };
const A_PTS = [[32, 9.6], [50.2, 54.4], [42.4, 54.4], [38.7, 43.8], [25.3, 43.8], [21.6, 54.4], [13.8, 54.4]];
const NOTCH = [[28, 37.1], [36, 37.1], [33.9, 43.2], [30.1, 43.2]];
const STROKES = [[45.2, 14.4, 53.2, 14.4], [53.2, 14.4, 53.2, 22.4], [53.2, 14.4, 37, 30.6]];
const STROKE_W = 4.2;

const BG = { stops: [[0, [0x43, 0x38, 0xca]], [0.55, [0x4f, 0x46, 0xe5]], [1, [0x7c, 0x3a, 0xed]]] };
const FG = { stops: [[0, [0xff, 0xff, 0xff]], [1, [0xe0, 0xe7, 0xff]]] };
const NOTCH_C = [0xa5, 0xb4, 0xfc];
const STROKE_C = [0xc7, 0xd2, 0xfe];

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
function gradient(stops, t) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i], [t1, c1] = stops[i + 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return [lerp(c0[0], c1[0], k), lerp(c0[1], c1[1], k), lerp(c0[2], c1[2], k)];
    }
  }
  return stops[stops.length - 1][1];
}
function inRect(cx, cy) {
  const qx = Math.abs(cx - 32) - (RECT.w / 2 - RECT.r);
  const qy = Math.abs(cy - 32) - (RECT.h / 2 - RECT.r);
  return (qx <= 0 && qy <= 0) || (Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) <= RECT.r);
}
function inPoly(cx, cy, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (((yi > cy) !== (yj > cy)) && (cx < (xj - xi) * (cy - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function segDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}
function onStroke(cx, cy) {
  const hw = STROKE_W / 2;
  for (const s of STROKES) if (segDist(cx, cy, s[0], s[1], s[2], s[3]) <= hw) return true;
  return false;
}

// ---------- render logo at N x N px (4x supersampled) ----------
function render(N) {
  const SS = 4;
  const png = new PNG({ width: N, height: N });
  const scale = N / 64;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const cx = (x + (sx + 0.5) / SS) / scale;
          const cy = (y + (sy + 0.5) / SS) / scale;
          let c = null;
          if (inRect(cx, cy)) c = gradient(BG.stops, (cx + cy) / 128);
          if (inPoly(cx, cy, A_PTS)) c = gradient(FG.stops, (cx + cy) / 128);
          if (inPoly(cx, cy, NOTCH)) c = NOTCH_C;
          if (onStroke(cx, cy)) c = STROKE_C;
          if (c) { r += c[0]; g += c[1]; b += c[2]; a++; }
        }
      }
      const idx = (y * N + x) * 4;
      if (a > 0) { r /= a; g /= a; b /= a; }
      png.data[idx] = Math.round(r);
      png.data[idx + 1] = Math.round(g);
      png.data[idx + 2] = Math.round(b);
      png.data[idx + 3] = Math.round(a / (SS * SS) * 255);
    }
  }
  return PNG.sync.write(png);
}

// ---------- write assets ----------
const png32 = render(32);
const png180 = render(180);
writeFileSync('favicon-32.png', png32);
writeFileSync('apple-touch-icon.png', png180);

// favicon.ico — single-entry ICO wrapping the 32px PNG (Vista+ supports PNG-in-ICO)
const ico = Buffer.alloc(22 + png32.length);
ico.writeUInt16LE(1, 2);        // type: icon
ico.writeUInt16LE(1, 4);        // count
ico[6] = 32; ico[7] = 32;       // size
ico.writeUInt16LE(1, 10);       // planes
ico.writeUInt16LE(32, 12);      // bit count
ico.writeUInt32LE(png32.length, 14); // bytes in image
ico.writeUInt32LE(22, 18);      // image offset
png32.copy(ico, 22);
writeFileSync('favicon.ico', ico);

// favicon.svg — copy of the real logo
writeFileSync('favicon.svg', readFileSync('logo.svg'));

// ---------- sanity spot-checks on the 32px PNG ----------
const chk = PNG.sync.read(png32);
const px = (x, y) => {
  const i = (y * 32 + x) * 4;
  return [chk.data[i], chk.data[i + 1], chk.data[i + 2], chk.data[i + 3]];
};
console.log('corner (0,0)   ->', px(0, 0).join(','), '(expect transparent)');
console.log('top-center     ->', px(16, 1).join(','), '(expect indigo ~= 43,38,202 gradient)');
console.log('center (in A)  ->', px(16, 16).join(','), '(expect near-white)');
console.log('stroke area    ->', px(24, 7).join(','), '(expect near 199,210,254)');
console.log('OK: favicon.svg, favicon-32.png, apple-touch-icon.png, favicon.ico written');
