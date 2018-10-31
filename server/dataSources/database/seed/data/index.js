const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

const loadData = file => {
  return parse(fs.readFileSync(path.join(__dirname, `${file}.csv`)), {
    columns: true,
    cast: true,
  });
};

module.exports = loadData;
