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
        cartItem.dose += 1;
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
        cartItem.dose -= 1;
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

const updatePrescription = async (res) => {
    try {
        // Fetch the prescription by ID
        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        // Update each medicine in the prescription with the corresponding cartItem
        cartItems.forEach(cartItem => {
            const medicineIndex = prescription.medicines.findIndex(
                medicine => medicine.name === cartItem.medName
            );

            if (medicineIndex !== -1) {
                prescription.medicines[medicineIndex].dose = cartItem.dose;
                prescription.medicines[medicineIndex].timing = cartItem.note;
                // You may need to update other fields as needed
            }
        });

        // Save the updated prescription to the database
        const updatedPrescription = await prescription.save();

        // Respond with the updated prescription
        res.status(200).json(updatedPrescription);
    } catch (error) {
        console.error('Error updating prescription medicines:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};





module.exports = { getPrescriptionById, updateCartItemQuantity, decrementCartItemQuantity ,deleteMedicineFromPrescription,updatePrescription};
