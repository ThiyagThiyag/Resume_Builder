const sharp = require('sharp');
const path = require('path');

const input = process.argv[2];
const output = process.argv[3];

sharp(input)
  .webp()
  .toFile(output)
  .then(() => console.log('Successfully converted image to WebP: ' + output))
  .catch(err => console.error('Error converting image:', err));
