const { ObjectId } = require('mongodb');
const { getDb } = require('./client');

const collectionName = 'todos';

function getId(id) {

  return ObjectId.isValid(id) ? ObjectId(id) : null;
}

function getCollection() {
  const db = getDb();
  return db.collection(collectionName);
}

exports.getTodos = async () => {
  const collection = getCollection();
  return collection.find().toArray();
};

exports.createTodo = async (name, done = false ) => {
  const collection = getCollection();
  const todo = { name, done };
  const result = await collection.insertOne(todo);
  const _id = result.insertedId;
  return { _id, ...todo };
};

exports.findAndUpdateTodo = async (id, modify) => {
  const collection = getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: getId(id) }, modify, { returnOriginal: false }
  );
  return result.value;
};

exports.findAndDeleteTodo = async (id) => {
  const collection = getCollection();
  const result = await collection.findOneAndDelete({ _id: getId(id) });
  return result.value;
};