const request = require('supertest');
const app = require('../src/app');

describe('Payouts API', () => {
  test('POST /v1/payouts - Create a new payout', async () => {
    const res = await request(app).post('/v1/payouts');
    if (res.statusCode === 400) {
      expect(res.body.error).toBe('No settled transactions available for payout');
    } else {
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('deductedFee');
    }
  });

  test('GET /v1/payouts - Fetch all payouts', async () => {
    const res = await request(app).get('/v1/payouts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
