import request from 'supertest';
import app from '../../src/app';

const REGISTER_URL = '/api/auth/register';
const LOGIN_URL = '/api/auth/login';
const ME_URL = '/api/auth/me';

const validPayload = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'securepassword123',
};

describe('POST /api/auth/register — input validation', () => {
  it('rejects an empty body with 400', async () => {
    const res = await request(app).post(REGISTER_URL).send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a missing name with 400', async () => {
    const res = await request(app)
      .post(REGISTER_URL)
      .send({ email: 'a@b.com', password: 'securepassword123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects an invalid email format with 400', async () => {
    const res = await request(app)
      .post(REGISTER_URL)
      .send({ ...validPayload, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a password shorter than 8 characters with 400', async () => {
    const res = await request(app)
      .post(REGISTER_URL)
      .send({ ...validPayload, password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects an invalid role with 400', async () => {
    const res = await request(app)
      .post(REGISTER_URL)
      .send({ ...validPayload, role: 'SUPERADMIN' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns a descriptive error message on validation failure', async () => {
    const res = await request(app).post(REGISTER_URL).send({});
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message.length).toBeGreaterThan(0);
  });
});

describe('POST /api/auth/login — input validation', () => {
  it('rejects an empty body with 400', async () => {
    const res = await request(app).post(LOGIN_URL).send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a missing password with 400', async () => {
    const res = await request(app)
      .post(LOGIN_URL)
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a missing email with 400', async () => {
    const res = await request(app)
      .post(LOGIN_URL)
      .send({ password: 'somepassword' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/auth/me — authentication middleware', () => {
  it('rejects a request with no Authorization header with 401', async () => {
    const res = await request(app).get(ME_URL);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects a malformed Bearer token with 401', async () => {
    const res = await request(app)
      .get(ME_URL)
      .set('Authorization', 'Bearer not.a.valid.jwt');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects a non-Bearer auth scheme with 401', async () => {
    const res = await request(app)
      .get(ME_URL)
      .set('Authorization', 'Basic dXNlcjpwYXNz');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Protected seller routes — authentication guard', () => {
  it('POST /api/drops without token returns 401', async () => {
    const res = await request(app).post('/api/drops').send({});
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/products without token returns 401', async () => {
    const res = await request(app).post('/api/products').send({});
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/sellers/orders without token returns 401', async () => {
    const res = await request(app).get('/api/sellers/orders');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
