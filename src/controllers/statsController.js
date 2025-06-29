const { fn, col, literal, Op } = require('sequelize');
const Sale = require('../models/sale');
const Client = require('../models/client');

exports.dailySales = async (req, res) => {
  const stats = await Sale.findAll({
    attributes: ['date', [fn('sum', col('value')), 'total']],
    group: ['date'],
    order: [['date', 'ASC']]
  });
  res.json(stats);
};

exports.clientStats = async (req, res) => {
  const clients = await Client.findAll({ include: Sale });
  if (!clients.length) return res.sendStatus(404);

  const result = clients.map(client => {
    const totalSales = client.Sales.reduce((a, b) => a + b.value, 0);
    const avgSale = client.Sales.length ? totalSales / client.Sales.length : 0;
    const uniqueDays = new Set(client.Sales.map(s => s.date)).size;
    return { id: client.id, name: client.name, totalSales, avgSale, uniqueDays };
  });

  const topVolume = result.reduce((a, b) => (b.totalSales > a.totalSales ? b : a));
  const topAvg = result.reduce((a, b) => (b.avgSale > a.avgSale ? b : a));
  const topFreq = result.reduce((a, b) => (b.uniqueDays > a.uniqueDays ? b : a));

  res.json({ topVolume, topAvg, topFreq });
};