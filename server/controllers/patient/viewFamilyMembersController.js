const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const familyModel = require('../../models/Family.js');
const LinkedFamilyModel = require('../../models/LinkedFamily.js');

const patientModel = require('../../models/Patient.js');
//const LinkedFamilyModel = require('../../models/LinkedFamily.js');

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
    const username = req.body.username;

    try {
        const addedFamilyMembers = await familyModel.find({ patient_username: username });
        const linkedFamilyMembers = await LinkedFamilyModel.find({ patient_username: username });

        if (!addedFamilyMembers && !linkedFamilyMembers) {
            return res.status(404).json({ error: 'Patient has no family members' });
        }

        const addedMembersWithType = addedFamilyMembers.map((member) => {
            return { ...member.toObject(), type: 'Added' };
        });

        const linkedMembersWithType = linkedFamilyMembers.map((member) => {
            return { ...member.toObject(), type: 'Linked' };
        });

        const familyMembers = [...addedMembersWithType, ...linkedMembersWithType];

        res.status(200).json(familyMembers);
    } catch (error) {
        res.status(500).json({ error: "Can't get your family members" });
    }
};


const viewLinkedFamilyMembers = async (req, res) => {
    const username = req.body.username;
    try {
        const familyMembers = await LinkedFamilyModel.find({ patient_username: username });
        if (!familyMembers) {
            return res.status(404).json({ error: 'Patient has no family members' });
        }
        res.status(200).json(familyMembers);
    } catch (error) {
        res.status(500).json({ error: "Can't get your family members" });
    }
}

const viewUnlinkedFamilyMembers = async (req, res) => {
    const username = req.body.username;
    //console.log(username);
    //retrieve family members for the passed patient username
    try {
        const familyMembers = await familyModel.find({ patient_username: username });
        if (!familyMembers) {
            return res.status(404).json({ error: 'Patient has no family members' });
        }
        //const familyMembers = await familyModel.find();
        res.status(200).json(familyMembers);
    } catch (error) {
        res.status(500).json({ error: "Can't get your family members" });
    }
}
module.exports = { viewFamilyMembers, viewLinkedFamilyMembers, viewUnlinkedFamilyMembers };

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



