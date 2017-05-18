const nailPolish = require('./nail_polish');
const fs = require('fs');
const util = require('util');

const brands = nailPolish.reduce((acc, b) => {
  if (!acc.includes(b.brand)) {
    acc.push(b.brand);
  }
  return acc;
}, []);

fs.writeFileSync('./brands.js', util.inspect(brands));
