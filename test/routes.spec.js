process.env.NODE_ENV = 'test';
const chaiHttp = require('chai-http');
const server = require('../server');
const chai = require('chai');

const should = chai.should();

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Everything', () => {
  before((done) => {
    database.migrate.latest()
   .then(() => {
     return database.seed.run();
   })
   .then(() => {
     done();
   });
  });

  beforeEach((done) => {
    database.seed.run()
   .then(() => {
     done();
   });
  });

  describe('API Routes', () => {
    describe('GET /api/v1/brands', () => {
      it('should return all of the brands', (done) => {
        chai.request(server)
        .get('/api/v1/brands')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('brand');
          response.body[0].brand.should.equal('pacifica');
          done();
        });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
        .get('/api/v1/foolfers')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('GET /api/v1/products', () => {
      it('should return all the products', (done) => {
        chai.request(server)
        .get('/api/v1/products')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('brand_id');
          response.body[0].brand_id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('7 Free Nail Polish Set - Red');
          done();
        });
      });

      it('should return 404 for a non existent route', (done) => {
        chai.request(server)
        .get('/api/v1/product')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });

      it('should return query for brand', (done) => {
        chai.request(server)
        .get('/api/v1/products?brand=pacifica')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('brand_id');
          response.body[0].brand_id.should.equal(1);
          done();
        });
      });

      it('should return error when no brands match', (done) => {
        chai.request(server)
        .get('/api/v1/products?brand=pacifi')
        .end((error, response) => {
          response.body.error.should.equal('No polish found for this brand');
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('GET /api/v1/products/:id', () => {
      it('should get product by id', (done) => {
        chai.request(server)
        .get('/api/v1/products/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('brand_id');
          response.body[0].brand_id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('7 Free Nail Polish Set - Red');
          done();
        });
      });

      it('should return error when no products match', (done) => {
        chai.request(server)
        .get('/api/v1/products/3sdf')
        .end((error, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('no product matching that id');
          done();
        });
      });
    });

    describe('GET /api/v1/brands/:id', () => {
      it('should get brand by id', (done) => {
        chai.request(server)
        .get('/api/v1/brands/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('brand');
          response.body[0].brand.should.equal('pacifica');
          done();
        });
      });

      it('should return error when no brands match', (done) => {
        chai.request(server)
        .get('/api/v1/brands/3sdf')
        .end((error, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('no brand matching that id');
          done();
        });
      });
    });

    describe('POST /api/v1/brands', () => {
      it('should create new brand', (done) => {
        chai.request(server)
        .post('/api/v1/brands')
        .send(
          {
            brand: 'Robbie',
          })
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('brandName');
          response.body.brandName.should.equal('Robbie');
          chai.request(server)
          .get('/api/v1/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(4);
          res.body[3].should.have.property('brand');
          res.body[3].brand.should.equal('Robbie');
          done();
        });
        });
      });

      it('should not create a record with missing data', (done) => {
        chai.request(server)
        .post('/api/v1/brands')
        .send({})
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data');
          done();
        });
      });

      it('should not create if unauthorized', (done) => {
        chai.request(server)
        .post('/api/v1/brands')
        .send({})
        .end((err, response) => {
          response.should.have.status(403);
          done();
        });
      });
    });

    describe('PATCH /api/v1/brands/:id', () => {
      it('should update brand name', (done) => {
        chai.request(server)
        .patch('/api/v1/brands/1')
        .set('Authorization', process.env.TOKEN)
        .send(
          {
            brand: 'Robbie',
          })
        .end((error, response) => {
          response.should.have.status(200);
          chai.request(server)
          .get('/api/v1/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[2].should.have.property('brand');
          res.body[2].brand.should.equal('Robbie');
          done();
        });
        });
      });

      it('should not patch a record with missing data', (done) => {
        chai.request(server)
        .patch('/api/v1/brands/94586')
        .set('Authorization', process.env.TOKEN)
        .send({})
        .end((err, response) => {
          (response.status === 404).should.equal(true);
          done();
        });
      });

      it('should not let you patch if not authorized', (done) => {
        chai.request(server)
        .patch('/api/v1/brands/94586')
        .send({
          brand: 'Robbie',
        })
        .end((err, response) => {
          (response.status === 403).should.equal(true);
          done();
        });
      });
    });

    describe('PATCH /api/v1/products/:id', () => {
      it('should update product info', (done) => {
        chai.request(server)
        .patch('/api/v1/products/1')
        .set('Authorization', process.env.TOKEN)
        .send(
          {
            name: 'Robbie',
          })
        .end((error, response) => {
          response.should.have.status(200);
          chai.request(server)
          .get('/api/v1/products/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Robbie');
          done();
        });
        });
      });

      it('should not let you patch if not authorized', (done) => {
        chai.request(server)
        .patch('/api/v1/products/1')
        .send({
          brand: 'Robbie',
        })
        .end((err, response) => {
          (response.status === 403).should.equal(true);
          done();
        });
      });

      it('should not patch a record with missing data', (done) => {
        chai.request(server)
        .patch('/api/v1/products/1')
        .set('Authorization', process.env.TOKEN)
        .send({})
        .end((err, response) => {
          (response.status === 422).should.equal(true);
          done();
        });
      });
    });

    describe('POST /api/v1/products/brands/:id', () => {
      it.skip('should create new product for a brand', (done) => {
        chai.request(server)
        .post('/api/v1/products/brands/1')
        .set('Authorization', process.env.TOKEN)
        .send(
          {
            name: 'Robbie',
            price: '3.50',
            rating: 3,
          })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.equal('Robbie');
          response.body.should.have.property('price');
          response.body.price.should.equal('3.50');
          response.body.should.have.property('rating');
          response.body.rating.should.equal(3);
          chai.request(server)
          .get('/api/v1/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[2].should.have.property('name');
          res.body[2].name.should.equal('Robbie');
          res.body[2].should.have.property('brand_id');
          res.body[2].brand_id.should.equal(1);
          done();
        });
        });
      });

      it('should not create a record for non-existant brand', (done) => {
        chai.request(server)
        .post('/api/v1/products/brands/100')
        .set('Authorization', process.env.TOKEN)
        .send(
          {
            name: 'Robbie',
            price: '3.50',
            rating: 3,
          })
        .end((err, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('no matching brand');
          done();
        });
      });

      it('should not create a record for missing rating', (done) => {
        chai.request(server)
        .post('/api/v1/products/brands/1')
        .set('Authorization', process.env.TOKEN)
        .send(
          {
            name: 'Robbie',
            price: '3.50',
          })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        });
      });

      it('should not create a record for missing price', (done) => {
        chai.request(server)
        .post('/api/v1/products/brands/1')
        .set('Authorization', process.env.TOKEN)
        .send(
          {
            name: 'Robbie',
            rating: 3,
          })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        });
      });

      it('should not create a record for missing name', (done) => {
        chai.request(server)
        .post('/api/v1/products/brands/1')
        .set('Authorization', process.env.TOKEN)
        .send(
          {
            price: '4.50',
            rating: 3,
          })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        });
      });

      it('should not post if unauthorized', (done) => {
        chai.request(server)
        .post('/api/v1/products/brands/1')
        .send({
          name: 'Robbie',
          price: '4.5',
          rating: 3,
        })
        .end((err, response) => {
          (response.status).should.equal(403);
          done();
        });
      });

      it('should not create a record with missing data', (done) => {
        chai.request(server)
        .post('/api/v1/products/brands/1')
        .set('Authorization', process.env.TOKEN)
        .send({})
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        });
      });
    });

    describe('DELETE /api/v1/brands/:id', () => {
      it('should delete brand by id with no foreign key relation', (done) => {
        chai.request(server)
        .delete('/api/v1/brands/3')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          done();
        });
        });
      });

      it('should delete brand by id with foreign key relation and change foreign keys to null', (done) => {
        chai.request(server)
        .delete('/api/v1/brands/2')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          chai.request(server)
          .get('/api/v1/products')
        .end((errProducts, resProducts) => {
          resProducts.should.have.status(200);
          resProducts.body.should.be.a('array');
          resProducts.body.length.should.equal(2);
          (resProducts.body[1].brand_id === null).should.equal(true);
          done();
        });
        });
        });
      });

      it('should not delete if unauthorized', (done) => {
        chai.request(server)
        .delete('/api/v1/brands/2')
        .send({})
        .end((err, response) => {
          response.should.have.status(403);
          done();
        });
      });

      it('should return error when no brand to delete', (done) => {
        chai.request(server)
        .delete('/api/v1/brands/3sdf')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('nothing deleted');
          done();
        });
      });
    });

    describe('DELETE /api/v1/products/:id', () => {
      it('should delete product by id', (done) => {
        chai.request(server)
        .delete('/api/v1/products/1')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('Suncoat Girl Water-Based Nail Polish');
          done();
        });
        });
      });

      it('should not delete if unauthorized', (done) => {
        chai.request(server)
        .delete('/api/v1/products/1')
        .send({})
        .end((err, response) => {
          response.should.have.status(403);
          done();
        });
      });

      it('should return error when no product to delete', (done) => {
        chai.request(server)
        .delete('/api/v1/products/3sdf')
        .set('Authorization', process.env.TOKEN)
        .end((error, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('nothing deleted');
          done();
        });
      });
    });
  });
});
