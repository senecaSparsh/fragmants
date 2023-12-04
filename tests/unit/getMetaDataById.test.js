const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  let authToken;

  beforeAll(async () => {
    // Log in and get the authentication token
    const loginRes = await request(app).post('/v1/login').send({
      email: 'user1@email.com',
      password: 'password1',
    });
    authToken = loginRes.body.token;
  });

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
      .set('Authorization', `Bearer ${authToken}`)
      .send(data);

    // Check if location header is present before attempting to split
    const id = postRes.headers.location ? postRes.headers.location.split('/').pop() : null;

    if (!id) {
      // Handle the case where id is not defined
      throw new Error('Fragment ID not found in response headers');
    }

    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .set('Authorization', `Bearer ${authToken}`);

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
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });
});
