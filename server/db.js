const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTables = async ()=>{
  const SQL =`
  DROP TABLE IF EXISTS favorites;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
  );
  CREATE TABLE products(
    id UUID PRIMARY KEY,
    name VARCHAR (100) UNIQUE NOT NULL 
  );
  CREATE TABLE favorites(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    CONSTRAINT favorite_unique UNIQUE (user_id, product_id)
  );
  `;
  await client.query(SQL);
};

const createUser = async ({ username, password}) => {
  const SQL = `
    INSERT INTO users(id, username, password)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)])
  return response.rows[0];
};

const createProduct = async ({ name }) => {
  const SQL = `
    INSERT INTO products(id, name)
    VALUES($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name])
  return response.rows[0];
};

const createFavorites = async ({ user_id, product_id}) => {
  const SQL = `
    INSERT INTO favorites (id, user_id, product_id)
    VALUES($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id])
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT *
    FROM users
  `;
  const response = await client.query(SQL)
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT *
    FROM products
  `;
  const response = await client.query(SQL)
  return response.rows;
};

const fetchFavorites = async (user_id) => {
  const SQL = `
    SELECT *
    FROM favorites
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id])
  return response.rows;
};

const destroyFavorites = async({ user_id, id}) => {
  const SQL =`
    DELETE FROM favorites
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [id, user_id]);
  if(!response.rows.length){
    const error = Error('no favorite found');
    error.status = 500;
    throw error;
  }
}

module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  createProduct,
  fetchProducts,
  createFavorites,
  fetchFavorites,
  destroyFavorites
};