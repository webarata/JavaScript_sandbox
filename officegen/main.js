'use strict';

const fs = require('fs');
const officegen = require('officegen-2');

const xlsx = officegen('xlsx');
xlsx.on('finalize', function(written) {
});

xlsx.on('error', function(error) {
  throw new Error(error);
});

const sheet = xlsx.makeNewSheet();
sheet.name = 'test';

sheet.data[0] = [];
sheet.data[0][0] = 'hoge';

const out = fs.createWriteStream('test.xlsx');

out.on('error', function(error) {
  throw new Error(error);
});

xlsx.generate(out);
