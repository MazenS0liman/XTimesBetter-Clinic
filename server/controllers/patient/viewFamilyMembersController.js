const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const familyModel = require('../../models/Family.js');
const LinkedFamilyModel = require('../../models/LinkedFamily.js');

const patientModel = require('../../models/Patient.js');

// const viewFamilyMembers = async (req, res) => {

//     const username = req.query;
//     //console.log(username);
//     //retrieve family members for the passed patient username
//     try {
//         const familyMembers = await familyModel.find({ patient_username: username.username });
//         if (!familyMembers) {
//             return res.status(404).json({ error: 'Patient has no family members' });
//         }
//         //const familyMembers = await familyModel.find();
//         res.status(200).json(familyMembers);
//     } catch (error) {
//         res.status(500).json({ error: "Can't get your family members" });
//     }
// }
// module.exports = { viewFamilyMembers };
const viewFamilyMembers = async (req, res) => {

    const username = req.query;
    //console.log(username);
    //retrieve family members for the passed patient username
    try {
        const familyMembers = await LinkedFamilyModel.find({ patient_username: username.username });
        if (!familyMembers) {
            return res.status(404).json({ error: 'Patient has no family members' });
        }
        //const familyMembers = await familyModel.find();
        res.status(200).json(familyMembers);
    } catch (error) {
        res.status(500).json({ error: "Can't get your family members" });
    }
}
module.exports = { viewFamilyMembers };

//retrieve all users from the database
/*try {
    // const familyMembers = await familyModel.find({}, { name: 1, relation: 1 });
    const familyMembers = await familyModel.find();

    res.status(200).json(familyMembers);
} catch (error) {
    res.status(500).json({ error: "Can't get your family members" });
}*/

//await familyModel.findByAge(age);
/* const { age } = req.params;
 const familyMembers = await familyModel.findById(age);
 
 if (!familyMembers) {
     return res.status(500).json({ error: "Can't get your family members" });
 }
 res.status(200).json(familyMembers);
*/



