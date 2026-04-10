import sharp from 'sharp';

async function generateFavicons() {
  const inputPath = './public/images/cruzar-logo-1.png';

  await sharp(inputPath)
    .resize(32, 32)
    .toFile('./public/favicon.ico');

  await sharp(inputPath)
    .resize(180, 180)
    .toFile('./public/apple-touch-icon.png');

  await sharp(inputPath)
    .resize(32, 32)
    .png()
    .toFile('./public/favicon-32x32.png');

  await sharp(inputPath)
    .resize(16, 16)
    .png()
    .toFile('./public/favicon-16x16.png');

  console.log('Favicons generated successfully.');
}

generateFavicons();
