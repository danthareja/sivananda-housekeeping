const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

const loadFixture = file => {
  return parse(fs.readFileSync(path.join(__dirname, `${file}.csv`)), {
    columns: true,
    cast: true,
  });
};

module.exports = loadFixture;
