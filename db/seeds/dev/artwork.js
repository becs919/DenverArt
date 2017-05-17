const path     = require('path');
const seedFile = require('knex-seed-file');

exports.seed = function(knex, Promise) {
  return Promise.all([knex('artwork').del(), knex('artists').del(), knex('material').del(), knex('location').del()])
    .then(() => seedFile(knex, path.resolve('./csv/public_art.csv'), 'artists', [
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
    .then(() => seedFile(knex, path.resolve('./csv/public_art.csv'), 'material', [
      null,
      null,
      null,
      null,
      'MATERIAL',
      null,
      null,
      null,
      null,
      null
    ], {
      columnSeparator: ',',
      ignoreFirstLine: true
    }))
    .then(() => seedFile(knex, path.resolve('./csv/public_art.csv'), 'location', [
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
    .then(() => seedFile(knex, path.resolve('./csv/public_art.csv'), 'artwork', [
      'ACCESSION_DATE',
      'YEAR_INSTALLED',
      'TITLE',
      null,
      null,
      null,
      'DETAILED_LOCATION',
      'NOTES',
      'POINT_X',
      'POINT_Y'
    ], {
      columnSeparator: ',',
      ignoreFirstLine: true
    }));
};
