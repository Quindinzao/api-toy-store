const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await request(app).post('/auth/register').send({ username: 'clientuser', password: '123456' });
  const res = await request(app).post('/auth/login').send({ username: 'clientuser', password: '123456' });
  token = res.body.token;
});

describe('Client CRUD', () => {
  let clientId;

  it('should create a client', async () => {
    const res = await request(app)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Lorde', email: 'lorde@api.com', birthDate: '1990-01-01' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email');
    clientId = res.body.email;
  });

  it('should list clients with redundant structure', async () => {
    const res = await request(app)
      .get('/clients')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('clientes');
    expect(Array.isArray(res.body.data.clientes)).toBe(true);

    const cliente = res.body.data.clientes.find(c =>
      c.info.nomeCompleto === 'Lorde'
    );

    expect(cliente).toBeDefined();
    expect(cliente.info).toHaveProperty('detalhes');
    expect(cliente.info.detalhes).toHaveProperty('email', 'lorde@api.com');
    expect(cliente.info.detalhes).toHaveProperty('nascimento', '1990-01-01');
    expect(cliente.estatisticas).toHaveProperty('vendas');
    expect(Array.isArray(cliente.estatisticas.vendas)).toBe(true);
  });

  it('should update a client', async () => {
    const res = await request(app)
      .put(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Lorde Atualizada', birthDate: '1990-01-01' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Lorde Atualizada');
  });

  it('should delete a client', async () => {
    const res = await request(app)
      .delete(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});

afterAll(async () => {
  await sequelize.close();
});