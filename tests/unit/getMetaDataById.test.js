const request = require('supertest');
const app = require('../../src/app');
describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', async () => {
    const response = await request(app).get('/v1/fragments/:id/info').set('Authorization', '');
    expect(response.statusCode).toBe(401);
  });
  // Correct credentials should give a success result with metadata about the fragment with the given id
  test('authenticated users get metadata about the fragment with the given id', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send(data);
    const id = postRes.headers.location.split('/').pop();
    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toMatchObject({
      status: 'ok',
      fragment: {
        id: id,
        type: 'text/plain',
        size: data.length,
        created: expect.anything(),
        updated: expect.anything(),
        ownerId: expect.anything(),
      },
    });
  });
  // Invalid id should return 404
  test('invalid id returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid_id/info')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});
