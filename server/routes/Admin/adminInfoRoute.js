var router = require('express').Router();
const { getAdminInfo } = require('../../controllers/Admin/adminInfoController');

router.get('/', getAdminInfo);

module.exports = router;