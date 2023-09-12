const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');

const expect = chai.expect;
chai.use(chaiHttp);
let server;

before((done) => {
  server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
    done();
  });
});

after((done) => {
  server.close(() => {
    console.log('Server has been shut down');
    done();
  });
});

describe('API Tests', () => {
  it('should return a conversion result', (done) => {
    chai
      .request(app)
      .get('/convert')
      .query({ source: 'USD', target: 'TWD', amount: '100' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        done();
      });
  });

  it('should handle missing parameters', (done) => {
    chai
      .request(app)
      .get('/convert')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error', 'Missing required parameters');
        done();
      });
  });

  it('should handle invalid amount', (done) => {
    chai
      .request(app)
      .get('/convert')
      .query({ source: 'USD', target: 'TWD', amount: 'invalid' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error', 'Invalid amount');
        done();
      });
    });
});
