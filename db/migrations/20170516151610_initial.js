exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('artists', function(table) {
      table.increments('id').primary();
      table.string('ARTIST');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('location', function(table) {
      table.increments('id').primary();
      table.string('LOCATION');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('artwork', function(table) {
      table.increments('id').primary();
      table.string('ACCESSION_DATE');
      table.string('YEAR_INSTALLED');
      table.string('TITLE');
      table.integer('ARTIST_ID').unsigned()
      table.foreign('ARTIST_ID')
        .references('artists.id');
      table.string('MATERIAL');
      table.integer('LOCATION_ID').unsigned()
      table.foreign('LOCATION_ID')
        .references('location.id');
      table.string('DETAILED_LOCATION');
      table.string('NOTES');
      table.string('POINT_X');
      table.string('POINT_Y');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('artwork'),
    knex.schema.dropTable('artists'),
    knex.schema.dropTable('location')
  ]);
};
