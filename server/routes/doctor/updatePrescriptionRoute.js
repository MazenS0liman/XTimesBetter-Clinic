const express = require('express');
const router = express.Router();
const{getPrescriptionById,updateCartItemQuantity,decrementCartItemQuantity,
    deleteMedicineFromPrescription,updatePrescription,
    }
 =
 require('../../controllers/doctor/updatePrescriptionController')


router.get('/getPrescriptionById/:id', getPrescriptionById);
router.put('/updateCartItemQuantity/:medName', updateCartItemQuantity);
router.put('/decrementCartItemQuantity/:medName', decrementCartItemQuantity);
router.delete('/deleteMedicineFromPrescription/:medName',deleteMedicineFromPrescription);
//router.put('/updateAllMedicineDosage/:medName/:newDosage',updateAllMedicineDosage);
//router.put('/updateMedicineDosage/:id/:medName/:newDosage',updateMedicineDosage);


router.put('/updatePrescription/:id', updatePrescription);




module.exports = router;