const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

let token, clientId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await request(app).post('/auth/register').send({ username: 'salesuser', password: '123456' });
  const res = await request(app).post('/auth/login').send({ username: 'salesuser', password: '123456' });
  token = res.body.token;

  const client = await request(app)
    .post('/clients')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Cliente Venda', email: 'cliente@venda.com', birthDate: '1990-01-01' });

  clientId = client.body.email;
});

describe('Sales', () => {
  let saleId;

  it('should create a sale', async () => {
    const res = await request(app)
      .post('/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId, value: 250.0, date: '2025-06-27' });

    expect(res.statusCode).toBe(201);
    saleId = res.body.id;
  });

  it('should list sales', async () => {
    const res = await request(app)
      .get('/sales')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete a sale', async () => {
    const res = await request(app)
      .delete(`/sales/${saleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});

afterAll(async () => {
  await sequelize.close();
});