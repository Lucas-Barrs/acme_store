const { 
  client, 
  createTables, 
  createUser, 
  fetchUsers,
  createProduct,
  fetchProducts,
  createFavorites,
  fetchFavorites
} = require('./db');

const init = async()=> {
  console.log('connecting to database');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables made');
  const [joey, ben, cassi, ro, cheese, chocolate, socks, yarn] = await Promise.all([
    createUser({username: 'joey', password: 'bug'}),
    createUser({username: 'ben', password: 'bird'}),
    createUser({username: 'cassi', password: 'lizard'}),
    createUser({username: 'ro', password: 'sock'}),
    createProduct({name: 'cheese'}),
    createProduct({name: 'chocolate'}),
    createProduct({name: 'socks'}),
    createProduct({name: 'yarn'}),
  ]);
  console.log(await fetchUsers());
  console.log(await fetchProducts());
  console.log(joey.id);
  console.log(chocolate.id);
  await Promise.all([
    createFavorites({ user_id: joey.id, product_id: chocolate.id})
  ]);
};

init();