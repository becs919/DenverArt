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
      database.seed.run()
      .then(() => {
        done();
      });
    });
  });

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done();
    });
  });

  describe('Client Routes', () => {
    it('should return the homepage with test', (done) => {
      chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        done();
      });
    });

    it('should return 404 for a non existent route', (done) => {
      chai.request(server)
      .get('/folders/urls')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('API Routes', () => {
    describe('GET /api/v1/brands', () => {
      it('should return all of the brands', (done) => {
        chai.request(server)
        .get('/api/v1/brands')
        .end((error, response) => {
          console.log(response.body[0]);
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
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
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
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
    });
// STOPPED HERE TESTING STILL NOT IN TEST ENV 
    describe('GET /api/v1/folders/:folder_id/urls', () => {
      it.skip('should return specific folder', (done) => {
        chai.request(server)
        .get('/api/v1/folders/1/urls')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('title');
          response.body[0].title.should.equal('TEST');
          done();
        });
      });

      it.skip('should return 404 for a non existent route', (done) => {
        chai.request(server)
        .get('/api/v1/folders/1/urlscddd')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('GET /:id', () => {
      it.skip('should redirect URL', (done) => {
        chai.request(server)
        .get('/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.redirects.should.be.a('array');
          response.redirects[0].should.equal('http://www.pinterest.com/');
          done();
        });
      });
    });

    describe('POST /api/v1/folders', () => {
      it.skip('should create new folder', (done) => {
        chai.request(server)
        .post('/api/v1/folders')
        .send(
          {
            title: 'Knuth',
          })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('title');
          response.body.title.should.equal('Knuth');
          chai.request(server)
          .get('/api/v1/folders')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[1].should.have.property('title');
          response.body[1].title.should.equal('Knuth');
          done();
        });
        });
      });

      it.skip('should not create a record with missing data', (done) => {
        chai.request(server)
        .post('/api/v1/folders')
        .send({})
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        });
      });
    });
  });

    describe('POST /api/v1/folders/:folder_id/urls', () => {
      it.skip('should create new url for a folder', (done) => {
        chai.request(server)
        .post('/api/v1/folders/1/urls')
        .send(
          {
            title: 'Marissa',
            fullURL: 'www.marissa.com',
            visited: 0,
            folder_id: 1,
          })
        .end((error, response) => {
          response.should.have.status(201);
          response.body[1].should.be.a('object');
          response.body[1].should.have.property('title');
          response.body[1].title.should.equal('Marissa');
          chai.request(server)
          .get('/api/v1/folders/1/urls')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[1].should.have.property('title');
          response.body[1].title.should.equal('Marissa');
          done();
        });
        });
      });

      it.skip('should not create a record with missing data', (done) => {
        chai.request(server)
        .post('/api/v1/folders/:folder_id/urls')
        .send({})
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        });
      });
    });
});
