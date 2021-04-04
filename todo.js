let id = 0;

function getId() {
  const currentId = id;
  id += 1;
  return currentId;
}

function createTodo(name) {
  const id = getId();
  return { id, name, done: false };
}

function respondWithError(res, error) {
  res.status(400);
  res.json({ error });
}

const todos = [createTodo('Dinner'), createTodo('shopping')];

exports.getTodos = () => todos;

exports.getList = (req, res) => {
  res.json(todos);
};

exports.create = (req, res) => {

  if (!req.body || !req.body.hasOwnProperty('name')) {
    return respondWithError(res, 'Name is missing!');
  }

  const { name } = req.body;

  if(typeof name !== 'string') {
    return respondWithError(res, 'Name should be a string');
  }

  if(name.trim() === '') {
    return respondWithError(res, 'Name should not be empty!');
  } else {
    
    const newTodo = createTodo(name);
    todos.push(newTodo);
    res.json(newTodo);
  }

};
exports.change = (req, res) => {
  res.json('Change item in todo list');
};
exports.delete = (req, res) => {
  res.json('Delete item from todo list');
};
exports.toggle = (req, res) => {
  res.send('Manage todo item');
};