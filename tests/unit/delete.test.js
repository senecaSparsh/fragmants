const request = require('supertest');
const app = require('../../src/app');

describe('Delete /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  test('deleted fragment successfully', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send('# This is a text')
      .set('Content-type', 'text/markdown');
    const id = req.body.fragment.id;

    const res = await request(app)
      .delete('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('invalid id delete request', async () => {
    const res = await request(app)
      .delete('/v1/fragments/invalidId')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe('fragment with that id is not found');
  });
});
