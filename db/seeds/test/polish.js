exports.seed = function(knex, Promise) {
  return knex('nailPolish').del()
    .then(() => knex('brands').del())
    .then(() => {
      return Promise.all([
        knex('brands').insert([
          { id: 1, brand: 'pacifica' },
          { id: 2, brand: 'suncoat' },
        ], 'id')
        .then(() => {
          return knex('nailPolish').insert([
            {
              brand_id: 1,
              name: '7 Free Nail Polish Set - Red',
              price: '21.5',
              image_link: 'https://d3t32hsnjxo7q6.cloudfront.net/i/135731beb1a0634f04ebea869dd45f03_ra,w158,h184_pa,w158,h184.jpg',
              product_link: 'https://well.ca/products/7-free-nail-polish-set-red_105172.html',
              website_link: 'https://well.ca',
              rating: 5,
              category: null,
              tag_list: [
                'Vegan',
              ],
            },
            {
              brand_id: 2,
              name: 'Suncoat Girl Water-Based Nail Polish',
              price: '8.29',
              image_link: 'https://d3t32hsnjxo7q6.cloudfront.net/i/492cefdf71c66968dd5c6da10cd9c385_ra,w158,h184_pa,w158,h184.jpg',
              product_link: 'https://well.ca/products/suncoat-girl-water-based-nail-polish_11968.html',
              website_link: 'https://well.ca',
              rating: 4,
              category: null,
              tag_list: [
                'Canadian',
                'Natural',
              ],
            },
          ]);
        }),
      ]);
    });
};
