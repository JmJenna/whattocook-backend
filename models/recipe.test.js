"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Recipe = require("./recipe.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {

  test("works", async function () {

    const result = await db.query(
          `SELECT title_id , title , img_url , username
           FROM recipes
           WHERE username = 'u1'`);
    expect(result.rows).toEqual([
      {
        title_id: 123,
        title: "title1",
        img_url: "http://title1.img",
        username: "u1",
      },
    ]);
  });

});


/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Recipe.remove("1");
    const res = await db.query(
        "SELECT id FROM recipes WHERE id='1'");
    expect(res.rows.length).toEqual(0);
  });

});
