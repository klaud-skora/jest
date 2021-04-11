const todo = require('./todo');
const request = require('supertest');
const { app } = require('./app');

let req;
let res;

function expectStatus(status) {
  if (status === 200) {
    return;
  }

  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(status);
};

function expectResponse(json) {
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(json);
  expect(res.send).not.toHaveBeenCalled();
};

function expectTextResponse(text) {
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith(text);
  expect(res.json).not.toHaveBeenCalled();
};

beforeEach(() => {

  req = {
    params: {},
  };
  res = {
    json: jest.fn(),
    status: jest.fn(),
    send: jest.fn(),
  };

});

describe('getList', () => {
  it('works', () => {
    todo.getList(req,res);
    const todos = todo.getTodos();

    expectStatus(200);
    expectResponse(todos);
  });
});

describe('create', () => {

  it('works', async () => {
    const response = await request(app).post('/add');

    expect(response.status).toEqual(400);
  });

  it('returns added task', () => {

    const mockName = 'Coffee';
    const todos = todo.getTodos();
    const { length } = todo.getTodos();

    req.body = { name: mockName };
    todo.create(req, res );

    expectStatus(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expectResponse(todos[todos.length - 1]);

    expect(todos).toHaveLength(length + 1);
    expect(todos[todos.length - 1].name).toEqual(mockName);
    expect(new Set(todos.map((todo) => todo.id)).size).toEqual(todos.length);
    expect(todos[todos.length - 1]).toMatchObject({
      name: mockName,
      done: false,
    });

  });

  it('throws an error because of no `name` property in the body', () => {
    req.body = {};
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });

  });

  it('no body', () => {
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });

  });

  it('handles an empty name', () => {
    req.body = { name: '' };
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });

  });

  it('handles an empty name (after triming)', () => {
    req.body = { name: '   ' };
    todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });


  });

  it('handles wrong name type', () => {
    req.body = { name: 43 };
    todo.create(req,res);

    expectStatus(400);
    expectResponse({ error: 'Name should be a string' });

  });

});

describe('change', () => {
  const mockName = 'Coffee';
  const mockId = 44;
  const nextName = "Tea";

  it('works', async () => {
    const response = await request(app).put('/1');

    expect(response.status).toEqual(400);
  });

  it('returns changed task', () => {
    todo.addTodo(todo.createTodo(mockName, mockId));
    const { length } = todo.getTodos();
    req.body = { name: nextName };
    req.params.id = mockId;

    todo.change(req, res );

    expectStatus(200);
    const todos = todo.getTodos();
    const changedTodo = todos.find((todo) => todo.id === mockId);

    expectResponse(todos.find((todo) => todo.id === mockId));
    expect(todos).toHaveLength(length);

    expect(changedTodo).toMatchObject({
      name: nextName,
    });
  });

  it('throws an error because of no `name` property in the body', () => {
    req.params.id = mockId;
    req.body = {};
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });
  });

  it('no body', () => {
    req.params.id = mockId;
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });
  });

  it('handles an empty name', () => {
    req.params.id = mockId;
    req.body = { name: '' };
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });
  });

  it('handles missing todo', () => {
    const unicId = 'whatever';
    todo.addTodo(todo.createTodo(mockName, mockId));
    const { length } = todo.getTodos();
    req.body = { name: nextName };
    req.params.id = unicId;

    todo.change(req, res );

    expectStatus(404);
    expectTextResponse('Not found');
  });

  it('handles an empty name (after triming)', () => {
    req.params.id = mockId;
    req.body = { name: '   ' };
    todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });
  });

  it('handles wrong name type', () => {
    req.body = { name: 43 };
    todo.change(req,res);

    expectStatus(400);
    expectResponse({ error: 'Name should be a string' });
  });

});

describe('delete', () => {
  const mockName = 'Coffee';
  const mockId = 44;
  const unicId = 'whatever';

  it('works', () => {
    todo.addTodo(todo.createTodo(mockName, mockId));

    const { length } = todo.getTodos();
    const todoDeleted = todo.getTodos().find((todo) => todo.id === mockId);
    req.params.id = mockId;

    todo.delete(req, res );
    
    const todos = todo.getTodos();

    expectResponse(todoDeleted);
    expectStatus(200);
    expect(todos).toHaveLength(length - 1);
    expect(todoDeleted).toMatchObject({ id: mockId});
  });

  it('handles missing todo', () => {
    req.params.id = unicId;

    todo.delete(req, res );

    expectStatus(404);
    expectTextResponse('Not found');
  });
});

describe('toggle', () => {

});