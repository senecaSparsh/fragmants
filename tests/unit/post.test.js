const request = require('supertest');
const app = require('../../src/app');
describe('POST /v1/fragments', () => {
  test('request not found', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@gmail.com', 'incorrect_password').expect(401));

  test('authenticated user get fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('unsupported type leads to failure', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'application/pdf');
    expect(res.statusCode).toBe(415);
  });

  test('fragment without data does not work', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send();
    expect(res.statusCode).toBe(500);
  });

  test('fragment with data work', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('Vishnu Das Puthukudi');

    var data = JSON.parse(res.text);
    expect(data.fragment.type).toBe('text/plain');
    expect(res.statusCode).toBe(201);
  });
});
