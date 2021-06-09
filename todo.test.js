const todo = require('./todo');
const request = require('supertest');
const { app } = require('./app');
const { getTodos, createTodo } = require('./db');
const { connect, disconnect, drop } = require('./client');

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

beforeAll(connect);
beforeEach(drop);
afterAll(disconnect);

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
  it('works', async () => {
    await todo.getList(req,res);
    const todos = await getTodos();
    expectStatus(200);
    expectResponse(todos);
  });
});

describe('create', () => {

  it('works and returns added task', async () => {

    const mockName = 'Coffee';
    const { length } = await getTodos();

    req.body = { name: mockName };
    await todo.create(req, res);

    const todos = await getTodos();
    
    expectStatus(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expectResponse(todos[todos.length - 1]);

    expect(todos).toHaveLength(length + 1);
    expect(todos[todos.length - 1].name).toEqual(mockName);
    expect(todos[todos.length - 1]).toMatchObject({
      name: mockName,
      done: false,
    });
    /*
    * not neccessary with mongo db
    */
    // expect(new Set(todos.map((todo) => todo.id)).size).toEqual(todos.length);

  });

  it('throws an error because of no `name` property in the body', async () => {
    req.body = {};
    await todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });

  });

  it('no body', async () => {
    await todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });

  });

  it('handles an empty name', async () => {
    req.body = { name: '' };
    await todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });

  });

  it('handles an empty name (after triming)', async () => {
    req.body = { name: '   ' };
    await todo.create(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });


  });

  it('handles wrong name type', async () => {
    req.body = { name: 43 };
    await todo.create(req,res);

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

  it('returns changed task', async () => {
    // await todo.addTodo(todo.createTodo(mockName, mockId));
    const { _id } = await createTodo(mockName);
    const { length } = await getTodos();
    req.body = { name: nextName };
    req.params.id = _id;

    await todo.change(req, res );

    expectStatus(200);
    const todos = await getTodos();
    const changedTodo = todos.find((todo) => todo._id.equals(_id));

    expectResponse(changedTodo);
    expect(todos).toHaveLength(length);

    expect(changedTodo).toMatchObject({
      name: nextName,
    });
  });

  it('throws an error because of no `name` property in the body', async () => {
    req.params.id = mockId;
    req.body = {};
    await todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });
  });

  it('no body', async () => {
    req.params.id = mockId;
    await todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name is missing!' });
  });

  it('handles an empty name', async () => {
    req.params.id = mockId;
    req.body = { name: '' };
    await todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });
  });

  it('handles missing todo', async () => {
    const unicId = 'whatever';
    await todo.addTodo(todo.createTodo(mockName, mockId));
    const { length } = await getTodos();
    req.body = { name: nextName };
    req.params.id = unicId;

    await todo.change(req, res );

    expectStatus(404);
    expectTextResponse('Not found');
  });

  it('handles an empty name (after triming)', async () => {
    req.params.id = mockId;
    req.body = { name: ' ' };
    await todo.change(req, res);

    expectStatus(400);
    expectResponse({ error: 'Name should not be empty!' });
  });

  it('handles wrong name type', async () => {
    req.body = { name: 43 };
    await todo.change(req,res);

    expectStatus(400);
    expectResponse({ error: 'Name should be a string' });
  });

});

describe('delete', () => {
  const mockName = 'Coffee';
  const mockId = 44;
  const unicId = 'whatever';

  it('works', async () => {
    // await todo.addTodo(todo.createTodo(mockName, mockId));
    const newTodo = await createTodo(mockName);
    const { _id } = newTodo;
    const { length } = await getTodos();
    // const todoDeleted = (await getTodos()).find((todo) => todo._id.equals(_id));
    req.params.id = _id;

    await todo.delete(req, res);
    
    const todos = await getTodos();

    expectResponse(newTodo);
    expectStatus(200);
    expect(todos).toHaveLength(length - 1);
    expect(newTodo).toMatchObject({ _id: _id });
  });

  it('handles missing todo', async () => {
    req.params.id = unicId;

    await todo.delete(req, res );

    expectStatus(404);
    expectTextResponse('Not found');
  });
});

describe('toggle', () => {
  const mockName = 'Coffee';
  const mockId = 44;
  const unicId = 'whatever';

  it('works', async () => {
    const newTodo = await createTodo(mockName);
    const { length } = await getTodos();
    req.params.id = newTodo._id;
    req.body = { ...newTodo };
    
    await todo.toggle(req, res);
    
    // const todoToggled = (await getTodos()).find((todo) => todo.id === mockId);
    const todos = await getTodos();
    const toggledTodo = todos.find((todo) => todo._id.equals(newTodo._id));
    expectStatus(200);
    expect(toggledTodo.done).toEqual(true);
    expect(todos).toHaveLength(length);
    expectResponse(toggledTodo);
  });

  it('works with changed done value', async () => {
    const newTodo = await createTodo(mockName, true);
    
    const { length } = await getTodos();
    req.params.id = newTodo._id;
    req.body = { ...newTodo };
    await todo.toggle(req, res);

    const todos = await getTodos();
    const toggledTodo = todos.find((todo) => todo._id.equals(newTodo._id));
    expectStatus(200);
    expect(toggledTodo.done).toEqual(false);
    expect(todos).toHaveLength(length);
    expectResponse(toggledTodo);
  });

  it('handles missing todo', async () => {
    req.params.id = unicId;
    req.body = { done: false }

    await todo.toggle(req, res );

    expectStatus(404);
    expectTextResponse('Not found');
  });


  it('no body', async () => {
    req.params.id = mockId;
    await todo.toggle(req, res);

    expectStatus(400);
    expectResponse({ error: 'Done is missing!' });
  });

  it('handles wrong done type', async () => {
    req.body = { done: 43 };
    await todo.toggle(req,res);

    expectStatus(400);
    expectResponse({ error: 'Done should be a boolean' });
  });

});