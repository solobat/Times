var path = require('path');

module.exports = {
    entry: {
      popup: './scripts/popup.js'
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
          {
            test: /\.js|\.jsx$/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
    }
}
