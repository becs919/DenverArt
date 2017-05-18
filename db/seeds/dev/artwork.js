const newPolishData = require('../../../data/newPolishData');
const brandsJS = require('../../../data/brands');


  // .then(() => {
  //   brandsJS.forEach((brand) => {
  //     return knex.table('brands').insert({brand}, 'id')
  //   })
  // })
  // .then(() => {
  //   const polishPromises = [];
  //   brandsJS.forEach(function (brand) {
  //     polishPromises.push(createBrand(knex, brand));
  //   });
  //   // Promise.all(polishPromises);
  // }).then(() => {
  //   console.log('hey');
  // }
// );
// );


// function createBrand(knex, brand) {
//   return knex.table('brands')
//     .returning('id')
//     .insert({ brand })
//     // .then(function (brandId) {
//
//       // knex('brands').select().where('brand', 'wet n wild')
//       //   .then((brand) => {
//       //     console.log(brand);
//       //   })
//     //   nailPolish.map((polish) => {
//     //     // polish.brand === brand.brand return brand.id
//     //     return knex('nailPolish')
//     //     .insert(
//     //       {
//     //         brand_id: brandId,
//     //         name: polish.name,
//     //         price: polish.price,
//     //         image_link: polish.image_link,
//     //         product_link: polish.product_link,
//     //         website_link: polish.website_link,
//     //         description: polish.description,
//     //         rating: polish.rating,
//     //         category: polish.category,
//     //         tag_list: polish.tag_list,
//     //       },
//     //     );
//     //   })
//     // });
// }
//
const brandData = (knex) => {
  return brandsJS.map((brand) => {
    return knex('brands').insert({ id:brand.id, brand:brand.brand }, 'id');
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
