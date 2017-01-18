const tinycolor = require('tinycolor2');

const normalizedRGB = ({ r, g, b }) => {
    const sum = r + g + b;
    return [
        r/sum,
        g/sum,
        b/sum
    ];
};

const classifySkin = ({ r, g, b }) => {
    const classifier = (
        (r > 95) &&
        (g > 40 && g < 100) &&
        (b > 20) &&
        ((Math.max(r,g,b) - Math.min(r,g,b)) > 15) &&
        (Math.abs(r-g)>15) &&
        (r > g) &&
        (r > b)
    );
    
    const [nR, nB, nG] = normalizedRGB({ r, g, b });
    const nRGBClassifer = (
        ((nR/nG)>1.185) &&
        (((r*b)/(Math.pow(r+g+b,2))) > 107) &&
        (((r*g)/(Math.pow(r+g+b,2))) > 0.112)
    );
    
    const { h, s } = tinycolor({ r, g, b }).toHsv();
    hsvClassifier = (h > 0 && h < 35 && s > 0.23 && s < 0.68);

    const res = (classifier || nRGBClassifer || hsvClassifier) ? 1 : 0;
    return res;
};

module.exports = {
    classifySkin
};