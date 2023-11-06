var router = require('express').Router();
const { updateAdminPassword } = require('../../controllers/Admin/changePasswordController');

router.put('/', updateAdminPassword);

module.exports = router;