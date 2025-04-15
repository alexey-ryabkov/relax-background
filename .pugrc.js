const path = require('path');
const self = require('pug');
const fs = require('fs');

module.exports = {
  locals: {
    srcPath: path.resolve(__dirname, 'src'),
    title: 'Relaxing background player',
    aboutLink:
      'https://github.com/alexey-ryabkov/relax-background?tab=readme-ov-file',
    playlist: JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'src/playlist.json')),
    ),
    self,
  },
};
