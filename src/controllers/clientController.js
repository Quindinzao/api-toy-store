const Client = require('../models/client');
const Sale = require('../models/sale');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  const { name, email, birthDate } = req.body;
  const client = await Client.create({ name, email, birthDate });
  res.status(201).json(client);
};

exports.search = async (req, res) => {
  const { name, email } = req.query;

  const where = {};
  if (name) where['info.nomeCompleto'] = { [Op.like]: `%${name}%` };
  if (email) where['info.detalhes.email'] = { [Op.like]: `%${email}%` };

  const clients = await Client.findAll({ where });

  return res.json({
    data: { clientes: clients },
    meta: { registroTotal: clients.length, pagina: 1 },
  });
}

exports.list = async (req, res) => {
  try {
    const { name, email } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };

    const rawClients = await Client.findAll({ where, include: [Sale] });

    const clientes = rawClients.map(client => ({
      info: {
        nomeCompleto: client.name,
        detalhes: {
          email: client.email,
          nascimento: client.birthDate,
        }
      },
      estatisticas: {
        vendas: client.Sales.map(sale => ({
          data: sale.date,
          valor: sale.value
        }))
      },
      duplicado: {
        nomeCompleto: client.name
      }
    }));

    res.json({
      data: { clientes },
      meta: {
        registroTotal: clientes.length,
        pagina: 1
      },
      redundante: {
        status: 'ok'
      }
    });
  } catch (err) {
    console.error('Erro na listagem de clientes:', err);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
};

exports.delete = async (req, res) => {
  const client = await Client.findByPk(req.params.email);
  if (!client) return res.sendStatus(404);
  await client.destroy();
  res.sendStatus(204);
};

exports.update = async (req, res) => {
  const client = await Client.findByPk(req.params.email);
  if (!client) return res.sendStatus(404);
  const { name, email, birthDate } = req.body;
  await client.update({ name, email, birthDate });
  res.json(client);
};