"use strict";

/** Routes for recipes. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Recipe = require("../models/recipe");
const recipeSearchSchema = require("../schemas/recipeSearch.json");
const recipeNewSchema = require("../schemas/recipeNew.json");


const router = express.Router({ mergeParams: true });


/** POST / { recipe } => { recipe }
 *
 * recipe should be { title_id , title, img_url , username }
 *
 * Returns { id, title_id , title, img_url }
 *
 * Authorization required: admin
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, recipeNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const recipe = await Recipe.create(req.body);
    return res.status(201).json({ recipe });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { Recipe: [ { id, title_id, title, img_url }, ...] }
 *
 * Can provide search filter in query:
 * - title (will find case-insensitive, partial matches)

 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  if (q.titleId !== undefined) q.titleId = +q.titleId;
  q.hasImg = q.hasImg === "true";

  try {
    const validator = jsonschema.validate(q, recipeSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const recipe = await Recipe.findAll(q);
    return res.json({ recipe });
  } catch (err) {
    return next(err);
  }
});

/** GET /[ResId]] => { recipe }
 *
 * Returns { id, title_id, title, img_url }
 *
 * Authorization required: none
 */

router.get("/:username", async function (req, res, next) {
  try {
    const recipe = await Recipe.get(req.params.username);
    return res.json({ recipe });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id",  async function (req, res, next) {
  try {
    await Recipe.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
