const fs = require('fs');
const path = require('path');

// 使用 Canvas API 生成 SVG，然後說明如何轉換
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// 確保目錄存在
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 為每個尺寸生成 SVG
sizes.forEach(size => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size / 8}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="${size * 0.6}" font-weight="bold"
        fill="#FFFFFF">L</text>
</svg>`;

  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, svg);
  console.log(`✓ 已生成: ${filename}`);
});

console.log('\n所有 SVG 圖標已生成！');
console.log('\n注意: PWA 需要 PNG 格式圖標');
console.log('請執行以下步驟轉換為 PNG:');
console.log('1. 在瀏覽器打開 scripts/generate-pwa-icons.html');
console.log('2. 或使用線上工具: https://www.pwabuilder.com/imageGenerator');
console.log('3. 或使用 ImageMagick 批次轉換 SVG 為 PNG');
