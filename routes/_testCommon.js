"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Recipe = require("../models/recipe");

const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM recipes");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });


  await Recipe.create(
    {
      id : 1,
      title_id : 123,
      title:"title1",
      img_url:"http://title1.img",
      username : "u1"
    });
await Recipe.create(
    {
      id : 2,
      title_id : 234,
      title:"title2",
      img_url:"http://title2.img",
      username : "u2"
    });
await Recipe.create(
    {
      id : 3,
      title_id : 345,
      title:"title3",
      img_url:"http://title3.img",
      username : "u3"
    });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};
