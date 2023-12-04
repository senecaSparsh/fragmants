const request = require('supertest');
const app = require('../../src/app');
describe('GET /v1/fragments/:id', () => {
  test('Request with non unauthetication are denied', () =>
    request(app).get('/v1/fragments').expect(401));
  test('Credentials with incorrect information are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_passowrd').expect(401));

  // test to update a fragment with valid user and password
  test('authenticated users can update a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    const id = postRes.headers.location.split('/').pop();
    const updateRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.status).toBe('ok');
  });
});
