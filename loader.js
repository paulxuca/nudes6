const getPixels = require('get-pixels');
const { scan } = require('./index');

const loadImageData = (path) => new Promise((resolve, reject) => {
    getPixels(path, function(err, pixels) {
        if (err) reject(err);
        resolve(pixels);
    });
});

loadImageData('./1.jpg')
.then(data => scan(data));