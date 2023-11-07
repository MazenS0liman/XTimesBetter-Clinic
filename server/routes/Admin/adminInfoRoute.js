var router = require('express').Router();
const { getAdminInfo } = require('../../controllers/Admin/adminInfoController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/', authenticateToken, getAdminInfo);

module.exports = router;