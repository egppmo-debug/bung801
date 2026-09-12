import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcTarget = buf.subarray(4, 8 + len);
  const crc = crc32(crcTarget);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function generatePng(size, isMaskable = false) {
  const width = size;
  const height = size;

  // Raw RGBA scanlines
  // Each row starts with filter byte 0
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(rowStride * height);

  const cx = width / 2;
  const cy = height / 2;

  // Safe radius
  // Maskable: content inside 70-80% safe zone
  const safeRadius = isMaskable ? width * 0.38 : width * 0.45;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      const t = (x + y) / (width + height); // gradient 0..1
      // Hanwha Brand Colors: from amber (245, 158, 11) to orange (234, 88, 12) to red (220, 38, 38)
      let r, g, b, a = 255;
      if (t < 0.5) {
        const factor = t * 2;
        r = Math.round(245 * (1 - factor) + 234 * factor);
        g = Math.round(158 * (1 - factor) + 88 * factor);
        b = Math.round(11 * (1 - factor) + 12 * factor);
      } else {
        const factor = (t - 0.5) * 2;
        r = Math.round(234 * (1 - factor) + 220 * factor);
        g = Math.round(88 * (1 - factor) + 38 * factor);
        b = Math.round(12 * (1 - factor) + 38 * factor);
      }

      // Rounded squircle corner for non-maskable icons
      if (!isMaskable) {
        const cornerR = width * 0.22;
        const qx = Math.max(cornerR - x, 0, x - (width - cornerR));
        const qy = Math.max(cornerR - y, 0, y - (height - cornerR));
        const dist = Math.sqrt(qx * qx + qy * qy);
        if (dist > cornerR) {
          a = 0; // transparent outside squircle
        } else if (dist > cornerR - 1.5) {
          a = Math.round(255 * (cornerR - dist) / 1.5);
        }
      }

      // Draw stylized building / AI icon in center
      const dx = x - cx;
      const dy = y - cy;
      const scale = size / 512;

      // Draw a white graphic in center
      // 1. Central tower
      const inCenterTower = Math.abs(dx) <= 60 * scale && dy >= -90 * scale && dy <= 120 * scale;
      // 2. Left tower
      const inLeftTower = dx >= -150 * scale && dx <= -75 * scale && dy >= -40 * scale && dy <= 120 * scale;
      // 3. Right tower
      const inRightTower = dx >= 75 * scale && dx <= 150 * scale && dy >= -40 * scale && dy <= 120 * scale;
      // 4. Pediment / roof peak
      const inRoof = dy >= -150 * scale && dy <= -90 * scale && Math.abs(dx) <= (150 * scale - (dy - (-150 * scale)) * 1.2);

      // Windows
      let isWindow = false;
      if (inCenterTower) {
        const winY = ((dy + 80 * scale) / (30 * scale)) % 1;
        const winX = ((dx + 50 * scale) / (30 * scale)) % 1;
        if (winY > 0.25 && winY < 0.75 && winX > 0.25 && winX < 0.75 && dy < 90 * scale) {
          isWindow = true;
        }
      }

      if (a > 0) {
        if ((inCenterTower || inLeftTower || inRightTower || inRoof) && !isWindow) {
          // Pure crisp white symbol with slight soft glow
          r = 255;
          g = 255;
          b = 255;
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // Color type 6 (RGBA)
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter standard
  ihdrData[12] = 0; // Non-interlaced
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, false));
console.log('Created pwa-192x192.png');

// 2. 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, false));
console.log('Created pwa-512x512.png');

// 3. 512x512 Maskable
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, true));
console.log('Created pwa-maskable-512x512.png');

// 4. Apple Touch Icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, false));
console.log('Created apple-touch-icon.png');

// 5. SVG icon for desktop browser tabs
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#dc2626" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#grad)" />
  <!-- Hanwha Building / AI Pillar Silhouette -->
  <g fill="#ffffff">
    <!-- Roof peak -->
    <path d="M 256 96 L 380 186 L 132 186 Z" />
    <!-- Pillars -->
    <rect x="156" y="206" width="46" height="180" rx="8" />
    <rect x="233" y="206" width="46" height="180" rx="8" />
    <rect x="310" y="206" width="46" height="180" rx="8" />
    <!-- Foundation -->
    <rect x="120" y="396" width="272" height="32" rx="10" />
  </g>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
console.log('Created icon.svg');
