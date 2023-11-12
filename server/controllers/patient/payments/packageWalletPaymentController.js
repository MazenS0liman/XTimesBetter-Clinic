const asyncHandler = require('express-async-handler');
const patients = require('../../../models/Patient');


const payPackage = asyncHandler(async (req, res) => {
    

    const registeredPatient = await patients.findOne({ username: req.body.paying_username });
    
    const totalAmount = req.body.priceAfter;
    console.log(totalAmount);

    if (registeredPatient) {
        console.log(registeredPatient);
        
        
        const patientWallet = registeredPatient.walletAmount;
        console.log(totalAmount <= patientWallet)
        if (totalAmount > patientWallet) {
            return res.status(400).json({ message: ' No Sufficient Funds in the wallet! ', success: false })
        }
        if (totalAmount <= patientWallet) {
            const newWalletAmout = patientWallet - totalAmount;
            const updatedPatient = await patients.findOneAndUpdate({ username: req.body.paying_username }, { walletAmount: newWalletAmout });

            
            return res.status(201).json({message: ' Payment done' , success: true, packObject: req.body});
        }
    }
    else {
        return res.status(400).json({ message: ' Patient not found', success: false });
    }
})




module.exports = { payPackage };
