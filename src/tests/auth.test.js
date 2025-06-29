const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username');
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

afterAll(async () => {
  await sequelize.close();
});