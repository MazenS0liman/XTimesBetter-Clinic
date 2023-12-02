const mongoose = require('mongoose');

const Prescription = require('../../models/Prescription');
const Medicine = require('../../models/Medicine');

let prescriptionId = '65668660eb56032a95d0010e';
let cartItems = []; // Shared variable for cartItems
// Call updatePrescription with the response object



// get prescriptionID  from sarah and CREATE cartitems
const getPrescriptionById = async (req, res) => {
   // prescriptionId = '65668660eb56032a95d0010e';
    try {
        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        // res.json(prescription);
        cartItems = prescription.medicines.map(medicine => ({
            medName: medicine.name,
            price_per_item: medicine.price,
            quantity: 1, // Each item starts with quantity 1
            dose: medicine.dose,
            note: medicine.timing,
        }));
        prescription.medicines = cartItems;
        res.json(cartItems);
        console.log( cartItems)
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).send('Internal Server Error');
    }
};

// increment the quantity of a cart item
const updateCartItemQuantity = async (req, res) => {
    const { medName } = req.params;

    const cartItem = cartItems.find((item) => item.medName === medName);
    const medicine = await Medicine.findOne({ name: medName });

    if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
   
    } else {
        cartItem.dose = parseInt(cartItem.dose, 10) + 1;
        res.status(200).json(cartItem);
        console.log( cartItems)
    }

    //console.log("inc", cartItems);
};

// decrement the quantity of a cart item
const decrementCartItemQuantity = async (req, res) => {
    const { medName } = req.params;

    const cartItem = cartItems.find((item) => item.medName === medName);
    const medicine = await Medicine.findOne({ name: medName });

    if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
    } else {
        cartItem.dose = parseInt(cartItem.dose, 10) - 1;
        res.status(200).json(cartItem);
        console.log( cartItems)
    }

   // console.log("dec", cartItems);
};
const deleteMedicineFromPrescription = async (req, res) => {
    const { medName } = req.params;
    //const cartItems = req.body.cartItems;
    console.log("delettte");

    console.log(cartItems);
    const index = cartItems.findIndex((item) => item.medName === medName);
    // console.log("Cart Items:", cartItems);
  
    if (index == -1) {
      return res.status(404).json({ error: "Cart item not found" });
    }
  
    // Remove the item from the cart using splice
    cartItems.splice(index, 1);
  
    res.status(204).send();
    console.log(cartItems);
};

const  updatePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }
        console.log("prescription:")
        console.log(prescription)
        console.log("cart items")
        console.log(cartItems)

        // Clear existing medicines and replace with cartItems
        prescription.medicines = cartItems.map(cartItem => ({
            name: cartItem.medName,
            price: cartItem.price_per_item,
            dose: cartItem.dose,
            timing: cartItem.note,
            note:cartItems.note
            // Add other fields as needed
        }));
       // console.log(prescription.medicines)
        const updatedPrescription = await prescription.save();

        res.status(200).json(updatedPrescription);
    } catch (error) {
        console.error('Error updating prescription medicines:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};






module.exports = { getPrescriptionById, updateCartItemQuantity, decrementCartItemQuantity ,deleteMedicineFromPrescription,updatePrescription};