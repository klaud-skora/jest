const todo = require('./todo');
const request = require('supertest');
const { app } = require('./app');

let req;
let res;
let next;

beforeEach(() => {

  req = {};
  res = {
    json: jest.fn(),
  };
  next = jest.fn();

});

describe('getList', () => {
  it('works', () => {

    todo.getList(req,res);
    expect(res.json).toHaveBeenCalledTimes(1);

  });
});

describe('create', () => {

  it('works', async () => {

    const response = await request(app).post('/add');
    expect(response.status).toEqual(500);
  });

  it('rerurns added task', () => {

    req.body = {
      name: 'coffee',
    };
    todo.create(req, res, next);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(req.body.name);

  });

  it('throws an error because of no `name` property in the body', () => {

    req.body = {};

    todo.create(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error('Name is missing!'));
    expect(res.json).not.toHaveBeenCalled();

  });

  it('no body', () => {

    todo.create(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error('Name is missing!'));
    expect(res.json).not.toHaveBeenCalled();

  });

  it('handles an empty name', () => {

    req.body = {
      name: '',
    };

    todo.create(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error('Name should not be empty!'));
    expect(res.json).not.toHaveBeenCalled();

  });

  it('handles an empty name (after triming)', () => {

    req.body = {
      name: '   ',
    };

    todo.create(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error('Name should not be empty!'));
    expect(res.json).not.toHaveBeenCalled();

  });

  it('handles wrong name type', () => {

    req.body = {
      name: 43,
    };

    todo.create(req,res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new Error('Name should be a string'));
    expect(res.json).not.toHaveBeenCalled();

  });

});

describe('change', () => {

});

describe('delete', () => {

});

describe('toggle', () => {

});