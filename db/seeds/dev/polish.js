const newPolishData = require('../../../data/newPolishData');
const brandsJS = require('../../../data/brands');

const brandData = (knex) => {
  return brandsJS.map((brand) => {
    return knex('brands').insert({ id: brand.id, brand: brand.brand }, 'id');
  });
};

const polishData = (knex) => {
  return newPolishData.map((polish) => {
    const {
        brand_id,
        name,
        price,
        image_link,
        product_link,
        website_link,
        rating,
        category,
        tag_list,
    } = polish;
    return knex('nailPolish').insert({
      brand_id,
      name,
      price,
      image_link,
      product_link,
      website_link,
      rating,
      category,
      tag_list,
    });
  });
};

exports.seed = (knex, Promise) => {
  return knex('nailPolish').del()
    .then(() => knex('brands').del())
    .then(() => {
      const brandDataAll = brandData(knex);
      const nailPolishAll = polishData(knex);
      return Promise.all([...brandDataAll, ...nailPolishAll]);
    });
};
