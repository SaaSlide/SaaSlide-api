const supertest = require("supertest")
const app = require("../index.js")
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);


global.app = app
global.request = supertest(app)

/* Variables for test */

global.token
global.testToken


describe('/POST user', () => {
    it('POST /auth/user/login : Log user', (done) => {
        const newLogin = {
        "email": "salsa@gmail.com",
        "password": "salsa69"
        }
      chai.request(app)

          .post('/auth/user/login')
          .send(newLogin)
          .end((err, res) => {
              console.log(res.should.have)
                res.should.have.status(201);
            done();
          });
    });
});