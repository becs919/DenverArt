const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.set('port', process.env.PORT || 3000);
app.locals.title = 'DenverArt';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/api/v1/brands', (request, response) => {
  database('brands').select()
    .then(brand => response.status(200).json(brand))
    .catch(error => console.error('error: ', error));
});

app.get('/api/v1/products', (request, response) => {
  database('nailPolish').select()
    .then(product => response.status(200).json(product))
    .catch(error => console.error('error: ', error));
});

app.get('/api/v1/brands/:id', (request, response) => {
  database('brands').where('id', request.params.id).select()
  .then((brand) => {
    response.status(200).json(brand);
  })
  .catch((error) => {
    console.error('error.html', error);
  });
});

app.get('/api/v1/products/:id', (request, response) => {
  database('nailPolish').where('id', request.params.id).select()
  .then((product) => {
    response.status(200).json(product);
  })
  .catch((error) => {
    console.error('error: ', error);
  });
});
// NOT ACTUALLY INSERTING
// app.post('/api/v1/brands', (request, response) => {
//   const brandName = request.body.brand;
//   const brand = request.body.title;
//
//   if (!brandName) {
//     response.status(422).send({
//       error: 'You are missing data!',
//     });
//   } else {
//     database('brands').insert(brand)
//     .then(() => {
//       response.status(201).json({
//         id: Math.floor(Math.random() * (500 - 30)) + 30,
//         brand: brandName,
//       });
//     })
//     .catch((error) => {
//       console.error('error: ', error);
//     });
//   }
// });

app.post('/api/v1/products/brands/:id', (request, response) => {
  const name = request.body.name;
  const price = request.body.price;
  const rating = request.body.rating;
  const brandId = request.params.id;

  database('brands').where('id', request.params.id).select()
  .then(() => {
    if (!name && !price && !rating) {
      response.status(422).send({
        error: 'You are missing data!',
      });
    } else {
      database('nailPolish').insert({ brand_id: brandId, name, price, rating })
      .then(() => {
        response.status(201).json({ brand_id: brandId, name, price, rating });
      })
      .catch((error) => {
        console.error('error: ', error);
      });
    }
  });
});

app.delete('/api/v1/products/:id', (request, response) => {
  database('nailPolish').where('id', request.params.id).delete()
  .then((product) => {
    response.status(200).json(product);
  })
  .catch((error) => {
    console.error('error: ', error);
  });
});

// app.delete('/api/v1/brands/:id', (request, response) => {
//   database('brands').where('id', request.params.id).delete()
//   .then((brand) => {
//     response.status(200).json(brand);
//   })
//   .catch((error) => {
//     console.error('error: ', error);
//   });
// });

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;
