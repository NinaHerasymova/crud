module.exports = {
  entry: './src/js/index.js',
}
const path = require('path')
module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, './src/js'),
    filename: 'index.js',
  },
}
