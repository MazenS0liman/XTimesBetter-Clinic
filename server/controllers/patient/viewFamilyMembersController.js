const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const familyModel = require('../../models/Family.js');

const viewFamilyMembers = async (req, res) => {

    //retrieve all users from the database
    try {
        // const familyMembers = await familyModel.find({}, { name: 1, relation: 1 });
        const familyMembers = await familyModel.find();

        res.status(200).json(familyMembers);
    } catch (error) {
        res.status(500).json({ error: "Can't get your family members" });
    }
    //await familyModel.findByAge(age);
    /* const { age } = req.params;
     const familyMembers = await familyModel.findById(age);
 
     if (!familyMembers) {
         return res.status(500).json({ error: "Can't get your family members" });
     }
     res.status(200).json(familyMembers);
 */

}
module.exports = { viewFamilyMembers };

