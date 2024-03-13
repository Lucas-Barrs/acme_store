const { client, createTables, createUser, fetchUsers } = require('./db');

const init = async()=> {
  console.log('connecting to database');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables made');
  const [joey, ben, cassi, ro] = await Promise.all([
    createUser({username: 'joey', password: 'bug'}),
    createUser({username: 'ben', password: 'bird'}),
    createUser({username: 'cassi', password: 'lizard'}),
    createUser({username: 'ro', password: 'sock'})
  ]);
  console.log(await fetchUsers());
};

init();