const mongoose = require('mongoose');

const Prescription = require('../../models/Prescription');
const Medicine = require('../../models/Medicine');


//let cartItems = []; // Shared variable for cartItems
// Call updatePrescription with the response object
let prescriptionId = ''


// get prescriptionID  from sarah and CREATE cartitems
const getPrescriptionById = async (req, res) => {
   // prescriptionId = '65668660eb56032a95d0010e';
   prescriptionId = req.params.id;
  // console.log(prescriptionId);

    try {
         let prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        // res.json(prescription);
        cartItems = prescription.medicines.map(medicine => ({
            medName: medicine.name,
            price_per_item: medicine.price,
            quantity: 1, // Each item starts with quantity 1
            dosage: medicine.dosage,
           
        }));
        prescription.medicines = cartItems;
        res.json(cartItems);
       // console.log( cartItems)
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
       // console.log( cartItems)
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
       // console.log( cartItems)
    }

   // console.log("dec", cartItems);
};
const deleteMedicineFromPrescription = async (req, res) => {
    const { medName } = req.params;
    //const cartItems = req.body.cartItems;
   // console.log("delettte");

    //console.log(cartItems);
    const index = cartItems.findIndex((item) => item.medName === medName);
    // console.log("Cart Items:", cartItems);
  
    if (index == -1) {
      return res.status(404).json({ error: "Cart item not found" });
    }
  
    // Remove the item from the cart using splice
    cartItems.splice(index, 1);

  
    res.status(204).send();
    //console.log(cartItems);
};

// const  updatePrescription = async (req, res) => {
     
//     try {
//         const prescription = await Prescription.findById(prescriptionId);
        
      
//         if (!prescription) {
//             return res.status(404).json({ error: 'Prescription not found' });
//         }
       

//         // Clear existing medicines and replace with cartItems
//         prescription.medicines = cartItems.map(cartItem => ({
//             name: cartItem.medName,
//             price: cartItem.price_per_item,
//             quantity:1,
//             dosage: cartItem.dosage
//         }));
        
//        // console.log(prescription.medicines)
//        console.log("new prescription:")
//        console.log(updatedPrescription)
//        console.log("cart items")
//        console.log(cartItems)
//        const updatedPrescription = await prescription.save();

//         res.status(200).json(updatedPrescription);
//     } catch (error) {
//         console.error('Error updating prescription medicines:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };
// const updateMedicineDosage = async (req, res) => {
//     const { prescriptionId, medName, dosage } = req.params;
//     console.log("hhe");
//     console.log(prescriptionId);
//     console.log(medName);
//     console.log(dosage);

//     try {
//         const updatedPrescription = await Prescription.findOneAndUpdate(
//             {
//                 _id: prescriptionId,
//                 'medicines.name': medName, // Use the array element condition
//             },
//             {
//                 $set: { 'medicines.$.dosage': dosage }, // Use the positional $ operator
//             },
//             { new: true } // Return the updated document
//         );

//         if (!updatedPrescription) {
//             return res.status(404).json({ error: 'Prescription or Medicine not found' });
//         }

//         res.status(200).json(updatedPrescription);
//     } catch (error) {
//         console.error('Error updating medicine dosage:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };



// const updateAllMedicineDosage = async (req, res) => {
//     const { medName , newDosage} = req.params;
//     console.log(newDosage);
//     const cartItem = cartItems.find((item) => item.medName === medName);
//     const medicine = await Medicine.findOne({ name: medName });

//     if (!cartItem) {
//         return res.status(404).json({ error: "Cart item not found" });
//     } else {
//         cartItem.dosage = newDosage;
//         res.status(200).json(cartItem);
//         console.log( cartItems)
//     }

// };
const updatePrescription = async (req, res) => {
    const { id } = req.params;  
    const { cartItems } = req.body;
  
    
    try {
        let  prescription = await Prescription.findById(id);
        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        //console.log("hena");
        //console.log("prescription:");
        //console.log(prescription);
        //console.log("cart items");
        //console.log(cartItems);

        if (cartItems.length === 0) {
            // If cartItems is empty, delete the prescription
            await Prescription.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Prescription deleted successfully' });
        }

        prescription.medicines = cartItems.map(cartItem => ({
            name: cartItem.medName,
            dosage: cartItem.dosage,
            price: cartItem.price_per_item,
        }));
        
        //console.log("before saving");
      
        const updatedPrescription = await prescription.save();

        res.status(200).json(updatedPrescription);
    } catch (error) {
        console.error('Error updating prescription:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};







module.exports = { getPrescriptionById, updateCartItemQuantity, decrementCartItemQuantity ,
    deleteMedicineFromPrescription,
    updatePrescription,
    };