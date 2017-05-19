const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('dotenv').config().parsed;

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('secretKey', config.CLIENT_SECRET);
const token = jwt.sign('user', app.get('secretKey'));
app.set('port', process.env.PORT || 3000);

if (!config.CLIENT_SECRET || !config.USERNAME || !config.PASSWORD) {
  throw 'Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file';
}

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.params.token ||
                request.headers['authorization'];

  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          message: 'Invalid authorization token.',
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
      success: false,
      message: 'You must be authorized to hit this endpoint',
    });
  }
};

app.get('/api/v1/brands', (request, response) => {
  database('brands').select()
    .then(brand => response.status(200).json(brand))
    .catch((error) => {
      response.status(404).send('no brands', error);
      response.status(500).send({ 'server error': error });
    });
});

app.get('/api/v1/products', (request, response) => {
  const brand = request.query.brand;
  if (!brand) {
    database('nailPolish').select()
    .then((products) => {
      response.status(200).json(products);
    })
    .catch((error) => {
      response.status(404).send('no brands', error);
      response.status(500).send({ 'error: ': error });
    });
  } else if (brand) {
    database('brands').where('brand', brand).first()
    .then((searchBrand) => {
      if (!searchBrand) {
        response.status(404).send({ error: 'No polish found for this brand' });
      } else {
        database('nailPolish').where('brand_id', searchBrand.id)
        .then((products) => {
          response.status(200).json(products);
        });
      }
    })
    .catch((error) => {
      response.status(404).send('no brands', error);
      response.status(500).send({ 'error: ': error });
    });
  }
});

app.get('/api/v1/brands/:id', (request, response) => {
  database('brands').where('id', request.params.id).select()
  .then((brand) => {
    response.status(200).json(brand);
  })
  .catch(() => {
    response.status(404).send('no brand matching that id');
  });
});

app.patch('/api/v1/brands/:id', checkAuth, (request, response) => {
  const name = request.body.brand;

  if (!name) {
    response.status(404).send('not found');
  } else {
    database('brands').where('id', request.params.id).update({ brand: name })
    .then(() => {
      response.status(200).send('updated');
    })
    .catch(() => {
      response.status(422).send('not updated');
    });
  }
});

app.patch('/api/v1/products/:id', checkAuth, (request, response) => {
  const name = request.body.name;
  const price = request.body.price;
  const rating = request.body.rating;

  database('nailPolish').where('id', request.params.id).update({ name, price, rating })
  .then(() => {
    response.status(200).send('updated');
  })
  .catch(() => {
    response.status(422).send('not updated');
  });
});

app.get('/api/v1/products/:id', (request, response) => {
  database('nailPolish').where('id', request.params.id).select()
  .then((product) => {
    response.status(200).json(product);
  })
  .catch(() => {
    response.status(404).send('no product matching that id');
  });
});

app.post('/api/v1/brands', checkAuth, (request, response) => {
  const brandName = request.body.brand;

  if (!brandName) {
    response.status(422).send({ error: 'You are missing data' });
  } else {
    database('brands').insert({ id: Math.floor(Math.random() * (500 - 30)) + 30, brand: brandName })
    .then(() => {
      response.status(201).json({ brandName });
    })
      .catch((error) => {
        response.status(404).send({ 'error: ': error });
        response.status(500).send({ 'error: ': error });
      });
  }
});

app.post('/api/v1/products/brands/:id', checkAuth, (request, response) => {
  const name = request.body.name;
  const price = request.body.price;
  const rating = request.body.rating;
  const brandId = request.params.id;

  database('brands').where('id', request.params.id).select()
  .then(() => {
    if (!name) {
      response.status(422).send({ error: 'You are missing data!' });
    } else if (!price) {
      response.status(422).send({ error: 'You are missing data!' });
    } else if (!rating) {
      response.status(422).send({ error: 'You are missing data!' });
    } else {
      database('nailPolish').insert({ brand_id: brandId, name, price, rating })
      .then(() => {
        response.status(201).json({ brand_id: brandId, name, price, rating });
      })
      .catch(() => {
        response.status(404).send('no matching brand');
      });
    }
  });
});

app.delete('/api/v1/products/:id', checkAuth, (request, response) => {
  database('nailPolish').where('id', request.params.id).delete()
  .then(() => {
    response.sendStatus(204);
  })
  .catch(() => {
    response.status(404).send('nothing deleted');
  });
});

app.delete('/api/v1/brands/:id', checkAuth, (request, response) => {
  database('nailPolish').where('brand_id', request.params.id).update({ brand_id: null })
  .then(() => {
    return database('brands').where('id', request.params.id).delete();
  })
  .then(() => {
    response.status(204).send('deleted');
  })
  .catch(() => {
    response.status(404).send('nothing deleted');
  });
});

module.exports = app;
