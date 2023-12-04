const request = require('supertest');
const app = require('../../src/app');
describe('GET /v1/fragments/:id', () => {
  test('Request with non unauthetication are denied', () =>
    request(app).get('/v1/fragments').expect(401));
  test('Credentials with incorrect information are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_passowrd').expect(401));
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });
  test('authenticated users get a fragments array with the given id', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const id = postRes.headers.location.split('/').pop();
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(data.toString());
  });
  const cheerio = require('cheerio');
  test('authenticated users get fragment data with the given id and extension', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    const id = postRes.headers.location.split('/').pop();
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.headers['content-type']).toMatch(/text\/html/);
    const $ = cheerio.load(getRes.text);
    expect($('body').length).toBeGreaterThan(0);
  });
});
