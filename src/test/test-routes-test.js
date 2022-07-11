const supertest = require("supertest");
const app = require("../../server.js");
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
const fs = require("fs");
const { fromPath } = require("pdf2pic");
const pdf = require("pdf-page-counter");

const expect = chai.expect;

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
        mail: "lucastestmocha11@mail.com",
        name: "lucastestmocha11",
        password: "lucastestmocha11",
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
        mail: "lucastestmocha11@mail.com",
        password: "lucastestmocha11",
      };
      chai
        .request(app)
        .post("/auth/login")
        .send(newLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("token");
          token = res.body.token;
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
  // describe("/DIAPO :", () => {
  //   it("1) POST Diapo", () => {

  //     const options = {
  //       density: 100,
  //       saveFilename: Date.now(),
  //       savePath: "./src/test/testpPng",
  //       format: "png",
  //       width: 1920,
  //       height: 1080,
  //     };

  //     let arrayOfPng = [];
  //     const storeAsImage = fromPath(`./src/test/testPdf/testPdf.pdf`, options);
  //     let dataBuffer = fs.readFileSync(`./src/test/testPdf/testPdf.pdf`);

  //     chai
  //     .request(app)
  //     .post("/api/diapo")
  //     .set("content-type", "multipart/form-data", {
  //       Authorization: `Bearer ${token}`,
  //     })
  //     .send(dataBuffer)
  //     .end((err, res) => {
  //       console.log('hola', res)
  //       // res.should.have.status(200);
  //       // done();
  //     });

  //     console.log(res)
  //   });
  // });
  //   const res = await chai
  //     .request(app)
  //     .post("/api/diapo")
  //     .set("content-type", "multipart/form-data", {
  //       Authorization: `Bearer ${token}`,
  //     })
  //   expect(res.status).to.equal(200);
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
