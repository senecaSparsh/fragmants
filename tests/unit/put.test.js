// tests/unit/get.test.js
const request = require('supertest');
const app = require('../../src/app');
const hash = require('../../src/hash');
const { readFragmentData } = require('../../src/model/data');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated user successfully update a fragment data', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .send('this is fragment 1')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');

    const res = await request(app)
      .put('/v1/fragments/' + post.body.fragment.id)
      .auth('user1@email.com', 'password1')
      .send('this is fragment 1 update')
      .set('Content-type', 'text/plain');

    expect(res.status).toBe(200);
    const id = res.body.fragment.id;

    const fragment = await readFragmentData(hash('user1@email.com'), id);

    const req = await request(app)
      .get('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1')
      .responseType('blob');

    const req1 = await request(app)
      .get('/v1/fragments/' + id + '/info')
      .auth('user1@email.com', 'password1');
    expect(req.body.fragment).toBe(req1.body.fragment);
    expect(req.body.toString()).toBe(fragment.toString());
  });

  test('authenticated user unsuccessfully update a fragment data', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .send('this is fragment 1')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');

    const res = await request(app)
      .put('/v1/fragments/' + post.body.fragment.id)
      .auth('user1@email.com', 'password1')
      .send('this is fragment 1 update')
      .set('Content-type', 'text/markdown');

    expect(res.status).toBe(400);

    const req = await request(app)
      .get('/v1/fragments/' + post.body.fragment.id)
      .auth('user1@email.com', 'password1')
      .responseType('blob');

    expect(req.body.toString()).toBe('this is fragment 1');
  });

  test('authenticated user try to update a fragment data with invalid id', async () => {
    const res = await request(app)
      .put('/v1/fragments/invalidId')
      .auth('user1@email.com', 'password1')
      .send('this is fragment 1 update')
      .set('Content-type', 'text/markdown');

    expect(res.status).toBe(404);
  });
});
