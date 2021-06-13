const request = require('supertest');
const { app } = require('./app');
const { connect, disconnect, drop } = require('./client');

beforeAll(connect);
beforeEach(drop);
afterAll(disconnect);

it('works', async () => {
  const response = await request(app).get('/');

  expect(response.status).toEqual(200);
  expect(response.header['content-type']).toEqual('application/json; charset=utf-8');

});
it('updates a todo', async () => {
  const name = 'Supper';
  const nextName = 'Egggggs';
  const createResponse = await request(app).post('/add').send({ name });

  expect(createResponse.status).toEqual(200);
  expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8');
  
  const toUpdate = JSON.parse(createResponse.text);
  expect(toUpdate).toMatchObject({ name, done: false });

  const { _id } = toUpdate;
  const response = await request(app).put(`/${_id}`).send({ name: nextName });

  expect(response.status).toEqual(200);
  const updatedTodo = JSON.parse(response.text);
  expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
  expect(updatedTodo).toMatchObject({ name: nextName, done: false });
});

it('deletes a todo', async () => {
  const name = 'Supper';
  const createResponse = await request(app).post('/add').send({ name });

  expect(createResponse.status).toEqual(200);
  expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8');
  
  const toUpdate = JSON.parse(createResponse.text);
  expect(toUpdate).toMatchObject({ name, done: false });

  const { _id } = toUpdate;
  const response = await request(app).delete(`/${_id}`).send();

  expect(response.status).toEqual(200);
  const updatedTodo = JSON.parse(response.text);
  expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
  expect(updatedTodo).toMatchObject({ name, done: false });
});

it('return an error when creating a todo without body', async () => {
  const response = await request(app).post('/add');

  expect(response.status).toEqual(400);
});

it('handles pages with 404 errors - not found', async () => {
  const response = await request(app).get('/whatever');

  expect(response.text).toEqual('Not found');
  expect(response.status).toEqual(404);

});