const request = require('supertest');

const app = require('../../src/app');

describe('app.js', () => {
  test('should get 404 error if requesting unknown route', () =>
    request(app).get('/no-such-route').expect(404));
});
