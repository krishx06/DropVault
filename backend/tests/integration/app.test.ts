import request from 'supertest';
import app from '../../src/app';

describe('App Integration Tests', () => {
  it('should return 200 OK and "DropVault Backend is running" for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('DropVault Backend is running');
    expect(response.body.success).toBe(true);
  });
});
