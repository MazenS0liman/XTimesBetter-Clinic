var router = require('express').Router();
const { viewContract, addContract, viewDoctors, acceptContract } = require('../../controllers/doctor/viewContractController');

router.get('/viewContract', viewContract);
router.post('/addContract', addContract);
router.get('/viewDoctors', viewDoctors);
router.get('/acceptContract', acceptContract);

module.exports = router;