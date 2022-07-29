"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");

class Recipe {
  /** Create a recipe (from data), update db, return new recipe data.
   *
   * data should be { title , img_url }
   *
   * Returns { id, title, img_url}
   **/    
   static async create(data) {
    const duplicateCheck = await db.query(
      `SELECT title , username
       FROM recipes
       WHERE title = $1 AND username = $2`,
    [data.title , data.username]);

  if (duplicateCheck.rows[0])
    throw new BadRequestError(`Duplicate recipe: ${data.title}`);

    const result = await db.query(
          `INSERT INTO recipes (title_id,
                             title,
                             img_url,
                             username)
           VALUES ($1, $2, $3, $4)
           RETURNING title_id, title, img_url, username`,
        [
          data.title_id,
          data.title,
          data.img_url,
          data.username
        ]);
    let recipe = result.rows[0];

        return recipe;
    }
    
  /** Given a username, return data about recipe.
   *
   * Returns { title , image_url }
   *   where username is [{ username , firstName , lastName , email }, ...]
   *
   * Throws NotFoundError if not found.
   **/

    static async get(username) {
      const userRes = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName"
            FROM users
            WHERE username = $1`,
          [username]);
  
      const user = userRes.rows[0];
  
      if (!user) throw new NotFoundError(`No fav recipe: ${username}`);

      const recipeRes = await db.query(
        `SELECT id , title_id , title , img_url , username
         FROM recipes
         WHERE username = $1
         ORDER BY id`,
      [username],
  );

  user.recipes = recipeRes.rows;
  
      return user;
    }

    /** Find all recipes (optional filter on searchFilters).
   *
   * searchFilters optional):
   * - title
   *
   * Returns [{ id, title_id, title, img_url }, ...]
   * */

  static async findAll({ title }) {
  let query = `SELECT id,
                      title_id,
                      title,
                      img_url
                FROM recipes;`;
  let whereExpressions = [];
  let queryValues = [];

  if (title !== undefined) {
    queryValues.push(`%${title}%`);
    whereExpressions.push(`title ILIKE $${queryValues.length}`);
  }

  // Finalize query and return results

  const resRes = await db.query(query, queryValues);
  return resRes.rows;
   }    

  /** Delete given recipe from database; returns undefined.
   *
   * Throws NotFoundError if recipe not found.
   **/
   
   static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM recipes
           WHERE id = $1
           RETURNING id`, [id]);
    const recipe = result.rows;

    if (!recipe) throw new NotFoundError(`No recipe: ${id}`);
  }

}

module.exports = Recipe;
