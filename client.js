const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName =  process.env.DBNAME || 'test-todos';

let client = null;

function resetClient() {
  client = null;
}

function getClient() {
  if (client === null) {
    throw new Error('Not connected to the database');
  } else return client;
}

exports.connect = async () => {
  client = await MongoClient.connect(url, { useUnifiedTopology: true });
};

exports.getDb = () => {
  const client = getClient();
  return client.db(dbName);
};

exports.drop = async () => {
  const client = getClient();
  const db = client.db(dbName);
  await db.dropDatabase();
};

exports.disconnect = async () => {
  const client = getClient();
  await client.close();
  await resetClient();
};

// async function main() {
//   await exports.connect();

//   const db = exports.getDb();
//   const collection = db.collection('todos');

//   await exports.drop();
//   await collection.find().toArray();
//   await collection.insertOne({ name: 'Foo', done: false });
//   await console.log(await collection.find().toArray());

//   await exports.disconnect(); 
// }

// main(); 