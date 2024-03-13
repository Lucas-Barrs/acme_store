const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store');
// const uuid = require('uuid');

const createTables = async ()=>{
  const SQL =`
  DROP TABLE IF EXISTS favorites;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL
  );
  CREATE TABLE products(
    id UUID PRIMARY KEY,
    name VARCHAR (100) UNIQUE NOT NULL 
  );
  CREATE TABLE favorites(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL
  );
  `;
  await client.query(SQL);
}

module.exports = {
  client,
  createTables
};