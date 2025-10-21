// tests/integration/app.test.js
import request from 'supertest';
import app from '../../src/app.js';

describe('GET /api/health', () => {
  test('debe responder con status 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
  });
});