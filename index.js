const { classifySkin } = require('./utils');
const ndarray = require('ndarray');
const UnionFind = require('union-find-js');

const scan = (imgData) => {
    const skinMap = [];
    const skinData = [];
    

    const [width, height] = imgData.shape;
    const ratio = Number((width/height).toPrecision(2));
    let x = 0;

    console.time('bottleneck');
    for (;x < width; x++) {
        for(let y = 0; y < height; y++) {
            const r = imgData.get(x, y, 0);
            const g = imgData.get(x, y, 1);
            const b = imgData.get(x, y, 2);

            const classifiedAsSkin = classifySkin({ r, g, b });
            skinMap.push(classifiedAsSkin);
        }
    }
    console.timeEnd('bottleneck');

    const twod = ndarray(skinMap, [width, height]);
    const twodClone = ndarray(new Array(skinMap.length), [width, height]);
    // const uf = {};
    const uf = new UnionFind(2000);
    let currid = 0;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (twod.get(x, y)) {
                if (twodClone.get(x, y - 1) && twodClone.get(x - 1, y)) { 
                    const s = [twodClone.get(x, y -1), twodClone.get(x - 1, y)];                    
                    const [parent, child] = s.sort();
                    twodClone.set(x, y, parent);
                    // uf[child] = parent;
                    uf.union(parent, child);
                } else {
                    if (twodClone.get(x, y - 1)) {
                        twodClone.set(x, y, twodClone.get(x, y -1));
                    } else if (twodClone.get(x - 1, y)) {
                        twodClone.set(x, y, twodClone.get(x - 1, y));
                    } else {
                        twodClone.set(x, y, currid);
                        currid+=1;
                    }
                }                
            } else {
                twodClone.set(x, y, 0);
            }
        }
    }


    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (twodClone.get(x, y)) {
                twodClone.set(x, y, uf.find(twodClone.get(x, y)));
            }
        }
    }


    const percentageSkin = twod.data.filter(e => e !== 0).length / twod.data.length;
    console.log(percentageSkin);

    const occurences = twodClone.data.reduce((t, e) => {
        const curr = t;
        if (e !== 0) {
            if (t[e]) {
                curr[e] = curr[e] + 1;
            } else {
                curr[e] = 1;
            }
        } 
        return curr;
    }, {});

    const top3Occurrences = Object.keys(occurences).map(e => Number(occurences[e])).sort(function(a, b){return b-a}).slice(0, 3)
    const top3OccurrencesPercentage = [];

    for (let x = 0 ; x < top3Occurrences.length; x++) {
        top3OccurrencesPercentage.push(top3Occurrences[x] / twod.data.filter(e => e !== 0).length);
    }

    console.log(top3OccurrencesPercentage);

};

module.exports = {
    scan
};
