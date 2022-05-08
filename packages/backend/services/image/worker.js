const sharp = require('sharp');

exports.resizeImageInWorker = async (dto) => {
  const { imageBuffer, width, height } = dto;
  console.log('running resize');

  const resizedImage = await sharp(imageBuffer)
                              .resize(width, height)
                              .jpeg()
                              .toBuffer();

  console.log('after resize');

  return resizedImage;
}