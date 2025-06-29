const Sale = require('../models/sale');
const Client = require('../models/client');

exports.create = async (req, res) => { 
  const { clientId, value, date } = req.body;

  const client = await Client.findByPk(clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const sale = await Sale.create({ clientId, value, date });
  res.status(201).json(sale);
};

exports.list = async (req, res) => {
  const { clientId } = req.query;
  const where = {};
  if (clientId) where.clientId = clientId;

  const sales = await Sale.findAll({ where });
  res.json(sales);
};

exports.delete = async (req, res) => {
  const sale = await Sale.findByPk(req.params.id);
  if (!sale) return res.sendStatus(404);
  await sale.destroy();
  res.sendStatus(204);
};
