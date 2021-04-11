const express = require('express');
const { respondNotFound } = require('./errorHandlers');

const todo = require('./todo');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.set('x-powered-by', false);

app.get('/', todo.getList);
app.post('/add', todo.create);
app.put('/:id', todo.change);
app.delete('/:id', todo.delete);
app.post('/toggle/:id', todo.toggle );

app.get('/error', (req, res) => {
  throw new Error('Ayayay!');
});

app.get('*', (req, res) => {
  return respondNotFound(res);
});

app.use((err, req, res, next) => {
  
  res.status(500);
  res.send('Something is not working properly, try it later.');

});

exports.app = app;