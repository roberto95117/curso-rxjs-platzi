const path = require('path');

module.exports = {
    entry: ['./src/index.js','./src/practicas.js','./src/canvas.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    mode: 'development'
}