import sharp from 'sharp';

async function generateOgImage() {
  const width = 1200;
  const height = 630;
  const bgColor = { r: 30, g: 58, b: 138, alpha: 1 };

  // Logo has no alpha channel (RGB only), so composite it directly onto the background
  const resizedLogoBuffer = await sharp('./public/images/cruzar-logo-1.png')
    .resize(350, null, { fit: 'inside' })
    .toBuffer();

  const resizedMeta = await sharp(resizedLogoBuffer).metadata();

  const left = Math.round((width - resizedMeta.width) / 2);
  const top = Math.round((height - resizedMeta.height) / 2);

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: bgColor,
    }
  })
    .composite([{ input: resizedLogoBuffer, left, top }])
    .jpeg({ quality: 90 })
    .toFile('./public/images/og-image.jpg');

  console.log('OG image generated: public/images/og-image.jpg (1200x630)');
}

generateOgImage();
