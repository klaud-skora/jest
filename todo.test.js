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
};

beforeEach(() => {

  req = {};
  res = {
    json: jest.fn(),
    status: jest.fn(),
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

});

describe('delete', () => {

});

describe('toggle', () => {

});