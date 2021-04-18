const { respondNotFound, respondWithError } = require('./errorHandlers');
let id = 0;
const todos = [createTodo('Dinner'), createTodo('shopping')];

function getId() {
  const currentId = id;
  id += 1;
  return currentId;
}

function createTodo(name, id = getId(), done = false) {
  return { id, name, done: done };
}

function addTodo(todo) {
  todos.push(todo);
}

function findTodo(id) {
  const numberId = Number(id);
  const todoToChange = todos.find((todo) => todo.id === numberId);
  return todoToChange;
}

function toggleTodo(id) {
  const numberId = Number(id);
  const todoToChange = todos.find((todo) => todo.id === numberId);
  todoToChange.done = !todoToChange.done;
  return todoToChange;
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

exports.getTodos = () => todos;

exports.addTodo = addTodo;
exports.createTodo = createTodo;

exports.getList = (req, res) => {
  res.json(todos);
};

exports.create = (req, res) => {
  const name = verifyName(req, res);

  if (!name) return;

  const newTodo = createTodo(name.name);
  addTodo(newTodo);
  res.json(newTodo);
};

exports.change = (req, res) => {
  const name = verifyName(req, res);

  if (!name) return;

  const todo = findTodo(req.params.id);

  if (!todo) return respondNotFound(res);
  todo.name = name.name;
  res.json(todo);
};
exports.delete = (req, res) => {
  const todo = findTodo(req.params.id);

  if (!todo) return respondNotFound(res);

  todos.splice(todos.indexOf(todo), 1); 

  res.json(todo);
};
exports.toggle = (req, res) => {
  const todo = findTodo(req.params.id);

  if (!todo) return respondNotFound(res);
  
  const toggledTodo = toggleTodo(todo.id);
  res.json(toggledTodo);
  
};