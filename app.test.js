const { app } = require('./app');
const request = require('supertest');

it('works', async () => {
  const response = await request(app).get('/');

  expect(response.status).toEqual(200);
  expect(response.header['content-type']).toEqual('application/json; charset=utf-8');

});

it('handles pages with 404 errors - not found', async () => {
  const response = await request(app).get('/whatever');

  expect(response.text).toEqual('Not found');
  expect(response.status).toEqual(404);

});