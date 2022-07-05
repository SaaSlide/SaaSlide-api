const supertest = require("supertest");
const app = require("../../server.js");
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);

global.app = app;
global.request = supertest(app);

/* Variables for test */

global.token;
global.testToken;

describe("/ENDPOINT :", () => {
  let token;
  describe("/AUTHENTIFICATION :", () => {
    it("1) POST Register", (done) => {
      const account = {
        mail: "lucastestmocha10@mail.com",
        name: "lucastestmocha10",
        password: "lucastestmocha10",
      };
      chai
        .request(app)
        .post("/auth/register")
        .send(account)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
    it("2) POST Login", (done) => {
      const newLogin = {
        mail: "lucastestmocha10@mail.com",
        password: "lucastestmocha10",
      };
      chai
        .request(app)
        .post("/auth/login")
        .send(newLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("token");
          token = res.body.token; //----------------TOKEN SET
          done();
        });
    });
    it("3) GET Current User", (done) => {
      chai
        .request(app)
        .get("/api/user")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("4) UPDATE Current User", (done) => {
      const updateUser = {
        name: "newlucastestmocha",
        mail: "newlucastestmocha@gmail.com",
        picture: "new picture",
        password: "newpassword",
      };
      chai
        .request(app)
        .put("/api/user/profile")
        .set({ Authorization: `Bearer ${token}` })
        .send(updateUser)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe("/DELETE USER :", () => {
    it("1) DELETE Current User", (done) => {
      chai
        .request(app)
        .delete("/api/user")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
