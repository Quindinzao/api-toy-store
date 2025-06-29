const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

let token, clientId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await request(app).post('/auth/register').send({ username: 'statsuser', password: '123456' });
  const res = await request(app).post('/auth/login').send({ username: 'statsuser', password: '123456' });
  token = res.body.token;

  const client = await request(app)
    .post('/clients')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Cliente Stats', email: 'cliente@stats.com', birthDate: '1990-01-01' });

  clientId = client.body.email;

  await request(app)
    .post('/sales')
    .set('Authorization', `Bearer ${token}`)
    .send({ clientId, value: 100, date: '2025-06-25' });

  await request(app)
    .post('/sales')
    .set('Authorization', `Bearer ${token}`)
    .send({ clientId, value: 200, date: '2025-06-25' });

  await request(app)
    .post('/sales')
    .set('Authorization', `Bearer ${token}`)
    .send({ clientId, value: 150, date: '2025-06-26' });
});

describe('Statistics', () => {
  it('should return daily sales', async () => {
    const res = await request(app)
      .get('/stats/daily')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ date: '2025-06-25', total: 300 }),
        expect.objectContaining({ date: '2025-06-26', total: 150 }),
      ])
    );
  });

  it('should return client statistics', async () => {
    const res = await request(app)
      .get('/stats/clients')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('topVolume');
  });
});

afterAll(async () => {
  await sequelize.close();
});