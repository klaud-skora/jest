const { respondNotFound, respondWithError } = require('./errorHandlers');
const { getTodos, createTodo, findAndUpdateTodo, findAndDeleteTodo } = require('./db');
let id = 0;
const todos = [deprecatedCreateTodo('Dinner'), deprecatedCreateTodo('shopping')];

function getId() {
  const currentId = id;
  id += 1;
  return currentId;
}

function deprecatedCreateTodo(name, id = getId(), done = false) {
  return { id, name, done: done };
}

function deprecatedAddTodo(todo) {
  todos.push(todo);
}


function verifyName(req, res) {
  if (!req.body || !req.body.hasOwnProperty('name')) {
    return respondWithError(res, 'Name is missing!');
  }

  const { name } = req.body;

  if(typeof name !== 'string') {
    return respondWithError(res, 'Name should be a string');
  }

  if(name.trim() === '') {
    return respondWithError(res, 'Name should not be empty!');
  } 

  return { name };
}
function verifyDone(req, res) {
  if (!req.body || !req.body.hasOwnProperty('done')) {
    return respondWithError(res, 'Done is missing!');
  }

  const { done } = req.body;

  if(typeof done !== 'boolean') {
    return respondWithError(res, 'Done should be a boolean');
  }
  return { done };
}

exports.getTodos = () => todos;

exports.addTodo = deprecatedAddTodo;
exports.createTodo = deprecatedCreateTodo;

exports.getList = async (req, res) => {
  const todos = await getTodos();
  res.json(todos);
};

exports.create = async (req, res) => {
  const name = verifyName(req, res);

  if (!name) return;

  const newTodo = await createTodo(name.name);
  // addTodo(newTodo);
  res.json(newTodo);
};

exports.change = async (req, res) => {
  const name = verifyName(req, res);

  if (!name) return;

  // const todo = findTodo(req.params.id);
  const todo = await findAndUpdateTodo(req.params.id, { $set: { name: name.name } }); 
  if (!todo) return respondNotFound(res);
  // todo.name = name.name;
  res.json(todo);
};
exports.delete = async (req, res) => {
  const todo = await findAndDeleteTodo(req.params.id);

  if (!todo) return respondNotFound(res);
  // todos.splice(todos.indexOf(todo), 1); 

  res.json(todo);
};
exports.toggle = async (req, res) => {
  const cleanDone = verifyDone(req, res);  
  if (!cleanDone) return;
  // const todo = findTodo(req.params.id);
  const todo = await findAndUpdateTodo(req.params.id, { $set: { done: !cleanDone.done } }); 
  if (!todo) return respondNotFound(res);
  // todo.name = name.name;
  res.json(todo);
  
};