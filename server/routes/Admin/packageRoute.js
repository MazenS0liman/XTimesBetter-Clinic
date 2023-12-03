var router = require('express').Router();
const { addPackage,updatePackage,deletePackage,viewPackage } = require('../../controllers/Admin/adjustPackagesController');

// APIs
router.post('/', addPackage);
router.put('/', updatePackage);
router.delete('/', deletePackage);
router.get('/',viewPackage);


module.exports = router;