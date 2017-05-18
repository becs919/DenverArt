exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('brands',
  function (table) {
    table.integer('id').primary();
    table.string('brand');

    table.timestamps(true, true);
  }),

    knex.schema.createTable('nailPolish',
    function (table) {
      table.increments('id').primary();
      table.integer('brand_id').unsigned();
      table.foreign('brand_id')
        .references('brands.id');
      table.string('name');
      table.string('price');
      table.string('image_link');
      table.string('product_link');
      table.string('website_link');
      table.string('rating');
      table.string('category');
      table.string('tag_list');

      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('nailPolish'),
    knex.schema.dropTable('brands'),
  ]);
};
