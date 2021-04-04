const todos = [
  {
    id: 1,
    name: 'Dinner', 
    done: 'false'
  },
  {
    id: 3,
    name: 'shopping', 
    done: 'false'
  }
];

exports.getList = (req, res) => {
  res.json(todos);
};
exports.create = (req, res, next) => {

  if (!req.body || !req.body.hasOwnProperty('name')) {
    return next(new Error('Name is missing!'));
  }

  if(typeof req.body.name !== 'string') {
    return next(new Error('Name should be a string'));
  }

  if(req.body.name.trim() === '') {
    return next(new Error('Name should not be empty!'));
  } else {
    const { name } = req.body;
    
    res.json(name);
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