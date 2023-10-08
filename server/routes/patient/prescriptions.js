const router = require('express').Router();
// const { getPrescription } = require('../../controllers/patient/prescriptionsController');
const { viewMyPrescriptions ,createPrescription,getPrescription,filterPrescriptionByDate,filterPrescriptionByDoctor,filterPrescriptionByfilled,selectPrescriptionFromMyList} = require('../../controllers/patient/prescriptionsController');
// APIs
router.get('/', viewMyPrescriptions);
router.get('/:id', getPrescription);
router.post('/', createPrescription);
router.get('/filter/date/:visitDate',filterPrescriptionByDate);
router.get('/filter/doctor/:name',filterPrescriptionByDoctor);
router.get('/filter/filled/:filledName',filterPrescriptionByfilled);
router.get('/select/:prescriptionSelect',selectPrescriptionFromMyList);

module.exports = router;