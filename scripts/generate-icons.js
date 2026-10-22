const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Create a simple mountain icon as SVG
const createIconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="#b45309"/>
  <path d="M${size/2} ${size*0.2} L${size*0.8} ${size*0.7} L${size*0.2} ${size*0.7} Z" fill="#ffffff" opacity="0.95"/>
  <path d="M${size*0.35} ${size*0.35} L${size*0.55} ${size*0.7} L${size*0.15} ${size*0.7} Z" fill="#ffffff" opacity="0.75"/>
  <path d="M${size/2} ${size*0.2} L${size*0.57} ${size*0.32} L${size/2} ${size*0.28} L${size*0.43} ${size*0.32} Z" fill="#fef3c7"/>
</svg>`;

async function generateIcons() {
  // Ensure directory exists
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  for (const size of sizes) {
    const svg = createIconSvg(size);
    const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
    
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Also create apple-touch-icon
  const appleSvg = createIconSvg(180);
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(iconDir, 'apple-touch-icon.png'));
  console.log('Generated: apple-touch-icon.png');

  // Create favicon
  const faviconSvg = createIconSvg(32);
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(iconDir, 'favicon-32x32.png'));
  console.log('Generated: favicon-32x32.png');

  await sharp(Buffer.from(createIconSvg(16)))
    .resize(16, 16)
    .png()
    .toFile(path.join(iconDir, 'favicon-16x16.png'));
  console.log('Generated: favicon-16x16.png');
}

generateIcons().then(() => {
  console.log('All icons generated successfully!');
}).catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
