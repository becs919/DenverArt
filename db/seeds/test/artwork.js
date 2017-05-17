const path = require('path');
const seedFile = require('knex-seed-file');

exports.seed = function(knex, Promise) {
  return Promise.all([knex('artists').del(), knex('location').del()])
    .then(() => seedFile(knex, path.resolve('./csv/test.csv'), 'artists', [
      null,
      null,
      null,
      'ARTIST',
      null,
      null,
      null,
      null,
      null,
      null
    ], {
      columnSeparator: ',',
      ignoreFirstLine: true
    }))
    .then(() => seedFile(knex, path.resolve('./csv/test.csv'), 'location', [
      null,
      null,
      null,
      null,
      null,
      'LOCATION',
      null,
      null,
      null,
      null
    ], {
      columnSeparator: ',',
      ignoreFirstLine: true
    }))
};
