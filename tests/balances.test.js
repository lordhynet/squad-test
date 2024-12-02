const request = require('supertest');
const app = require('../src/app');

describe('Balances API', () => {
  test('GET /v1/balances - Fetch merchant balances', async () => {
    const res = await request(app).get('/v1/balances');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('available');
    expect(res.body).toHaveProperty('pending_settlement');
    expect(typeof res.body.available).toBe('number');
    expect(typeof res.body.pending_settlement).toBe('number');
  });
});
