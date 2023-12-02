const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const familyModel = require('../../models/Family.js');
const patientModel = require('../../models/Patient.js');


const addFamilyMember = async (req, res) => {
    const username = req.body.username;
    try {
        const familyMember = await familyModel.create({
            ...req.body,
            patient_username: username,
        });

        res.status(201).json(familyMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the family member' });

    }
};

// const addFamilyMember = async (req, res) => {
//     try {

//         // const patient = await patientModel.findOne({
//         //     username: req.body.patient_username,
//         // });
//         /* if (!patient) {
//              return res.status(404).json({ error: 'Patient does not exist' });
//          }*/
//         // if (!patient) {
//         //     console.log('ss');
//         //     return res.status(404).json('ss');
//         // }
//         const familyMember = await familyModel.create(req.body);
//         console.log(req.body);
//         res.status(201).json(familyMember);
//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }
// const addFamilyMember = async (req, res) => {
//     try {
//         // Create the family member
//         const familyMember = await familyModel.create({
//             ...req.body,
//             patient_username: req.user.patient_username, // Assuming 'req.user' contains the logged-in patient information
//         });

//         // Send response with the created family member
//         res.status(201).json(familyMember);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };


module.exports = { addFamilyMember };