const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const familyModel = require('../../models/Family.js');

const addFamilyMember = async (req, res) => {
    try {
        await familyModel.create(req.body);
        res.status(201).json(familyModel);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { addFamilyMember };