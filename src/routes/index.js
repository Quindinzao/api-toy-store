const express = require('express');
const router = express.Router();

const clientCtrl = require('../controllers/clientController');
const saleCtrl = require('../controllers/saleController');
const statsCtrl = require('../controllers/statsController');
const authCtrl = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

router.post('/clients', auth, clientCtrl.create);
router.get('/clients', auth, clientCtrl.list);
router.get('/clients/search', auth, clientCtrl.search);
router.put('/clients/:email', auth, clientCtrl.update);
router.delete('/clients/:email', auth, clientCtrl.delete);

router.post('/sales', auth, saleCtrl.create);
router.get('/sales', auth, saleCtrl.list);
router.delete('/sales/:id', auth, saleCtrl.delete);

router.get('/stats/daily', auth, statsCtrl.dailySales);
router.get('/stats/clients', auth, statsCtrl.clientStats);

module.exports = router;