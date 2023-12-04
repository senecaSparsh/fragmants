// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('error 404', () => {
  test('404 error', () => request(app).get('/wrongPath').expect(404));
});
