const request = require('supertest');
const app = require('../src/app');

describe('Transactions API', () => {
  test('POST /v1/transactions - Create a new transaction', async () => {
    const res = await request(app)
      .post('/v1/transactions')
      .send({
        type: 'card',
        value: 5000,
        description: 'Test transaction',
        currency: 'NGN',
        cardLast4: '1234',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('reference');
    expect(res.body.type).toBe('card');
    expect(res.body.status).toBe('pending');
  });

  test('POST /v1/transactions - Fail on missing fields', async () => {
    const res = await request(app)
      .post('/v1/transactions')
      .send({
        type: 'card',
        value: 5000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing required fields');
  });

  test('GET /v1/transactions - Fetch all transactions', async () => {
    const res = await request(app).get('/v1/transactions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('reference');
      expect(res.body[0]).toHaveProperty('type');
      expect(res.body[0]).toHaveProperty('status');
    }
  });
});

describe('Transaction Settlement API', () => {
  test('PATCH /v1/transactions/:reference/settle - Settle a pending transaction', async () => {
    const createRes = await request(app)
      .post('/v1/transactions')
      .send({
        type: 'card',
        value: 5000,
        description: 'Test transaction',
        currency: 'NGN',
        cardLast4: '1234',
      });

    const reference = createRes.body.reference;

    const settleRes = await request(app)
      .patch(`/v1/transactions/${reference}/settle`)
      .send();

    expect(settleRes.statusCode).toBe(200);
    expect(settleRes.body).toHaveProperty('reference', reference);
    expect(settleRes.body).toHaveProperty('status', 'success');
  });

  test('PATCH /v1/transactions/:reference/settle - Fail if transaction not found', async () => {
    const res = await request(app)
      .patch('/v1/transactions/nonexistent/settle')
      .send();

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Transaction not found');
  });

  test('PATCH /v1/transactions/:reference/settle - Fail if transaction is not pending', async () => {
    const createRes = await request(app)
      .post('/v1/transactions')
      .send({
        type: 'card',
        value: 5000,
        description: 'Test transaction',
        currency: 'NGN',
        cardLast4: '1234',
      });

    const reference = createRes.body.reference;

    await request(app)
      .patch(`/v1/transactions/${reference}/settle`)
      .send();

    const settleRes = await request(app)
      .patch(`/v1/transactions/${reference}/settle`)
      .send();

    expect(settleRes.statusCode).toBe(400);
    expect(settleRes.body).toHaveProperty('error', 'Transaction is not in a pending state');
  });
});
