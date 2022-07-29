"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /recipes */

describe("POST /recipes", function () {
  const newRecipe = {
    title_id: 12345,
    title: "title12345",
    img_url: "http://new.img",
    username : 'u1'
  };


  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/recipes")
        .send({title:"testtile"})
    expect(resp.statusCode).toEqual(201);
  });


});

/************************************** GET /recipes */

describe("GET /recipes", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/recipes");
    expect(resp.body).not.toEqual({
      recipes:
          [
            {
                id : 158,
                title_id : 123,
                title:"title1",
                img_url:"http://title1.img",
                username : "u1"
            },
            {
                id : 159,
                title_id : 234,
                title:"title2",
                img_url:"http://title2.img",
                username : "u2"
            },
            {
                id : 160,
                title_id : 345,
                title:"title3",
                img_url:"http://title3.img",
                username : "u3"
            },
          ],
    });
  });
});

/************************************** DELETE /recipes/:id */

describe("DELETE /recipes/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/recipes/1`);
    expect(resp.body).toEqual({ deleted: 1 });
  });
});
