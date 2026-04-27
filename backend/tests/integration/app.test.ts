import request from 'supertest';
import app from '../../src/app';

describe('Health check', () => {
  it('GET / returns 200 with correct payload', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('DropVault Backend is running');
  });

  it('GET / includes a timestamp', async () => {
    const res = await request(app).get('/');
    expect(res.body.timestamp).toBeDefined();
    expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
  });
});

describe('Unknown routes', () => {
  it('returns 404 for an undefined GET route', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for an undefined POST route', async () => {
    const res = await request(app).post('/api/does-not-exist').send({});
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
