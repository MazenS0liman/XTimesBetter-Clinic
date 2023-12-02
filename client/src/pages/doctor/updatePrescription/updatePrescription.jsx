import React, { useState, useEffect } from 'react';
import axios from 'axios';

const prescriptionId = '65668660eb56032a95d0010e'
const updatePrescription = ({ prescriptionId }) => {
    const [cartItems, setCartItems] = useState([]);
    
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/doctor/updatePrescriptions/getPrescriptionById/${prescriptionId}`);
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        // Call the function to fetch cart items
        fetchCartItems();
    }, [prescriptionId]);

    const updateCartItemQuantity = (medName) => {
        // console.log(medName)
         // Send a PUT request to update the quantity of a cart item
         axios.put(`http://localhost:5000/doctor/updatePrescriptions/updateCartItemQuantity/${medName}`, { medName, cartItems })
           .then((response) => {
             // Find the item in your cartItems state by its medName
             const updatedCartItems = cartItems.map((item) => {
               if (item.medName === medName) {
                 // Update the quantity of the matching item
                 return { ...item, dose: response.data.dose };
               }
               return item;
             });
     
             // Set the state with the updated cart items
             setCartItems(updatedCartItems);
             sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Added - Nour
           })
           .catch((error) => {
             console.error('Error updating quantity:', error);
     
             // Check if there is a response from the server
             if (error.response && error.response.status === 400) {
               alert("Bad Request: " + error.response.data.message);
             }
           });
       };

       const decrementCartItemQuantity = (medName) => {
        // Send a PUT request to decrement the quantity of a cart item
        axios.put(`http://localhost:5000/doctor/updatePrescriptions/decrementCartItemQuantity/${medName}`, { medName, cartItems })
          .then((response) => {
            // Find the item in your cartItems state by its medName
            const updatedCartItems = cartItems.map((item) => {
              if (item.medName === medName) {
                // Update the quantity of the matching item
                return { ...item, dose: response.data.dose };
              }
              return item;
            });
    
            // Set the state with the updated cart items
            setCartItems(updatedCartItems);
            sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Added - Nour
          })
          .catch((error) => {
            console.error('Error decrementing quantity:', error);
    
            // Check if there is a response from the server
            if (error.response && error.response.status === 400) {
              alert("Bad Request: " + error.response.data.message);
            }
          });
      };
    
      const deleteMedicineFromPrescription = (medName) => {
        // Send a DELETE request to delete a cart item
        axios.delete(`http://localhost:5000/doctor/updatePrescriptions/deleteMedicineFromPrescription/${medName}`, { data: { medName, cartItems } })
          .then(() => {
            setCartItems(cartItems.filter((item) => item.medName !== medName));
            console.log("after deletion--", cartItems.filter((item) => item.medName !== medName))
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems.filter((item) => item.medName !== medName))); 
          })
          .catch((error) => console.error('Error deleting item:', error));
      };

      const updateMedicineFromPrescription = (prescriptionId) => {
        axios.put(`http://localhost:5000/doctor/updatePrescriptions/updatePrescription/${prescriptionId}`, { data: { prescriptionId, cartItems } })
            .then(() => {
                // Update the cart items on the frontend after a successful update
                setCartItems(cartItems.filter((item) => item.medName !== prescriptionId));
    
                // Update the stored cart items in sessionStorage
                sessionStorage.setItem('cartItems', JSON.stringify(cartItems.filter((item) => item.medName !== prescriptionId)));
            })
            .catch((error) => console.error('Error updating prescription:', error));
    };
    


   


     


   
   
     

    return (
        <div>
            <h2>Update Prescription</h2>
            <table>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        
                        <th>Dose</th>
                        <th>Quantity</th>
                        <th>Note</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.medName}</td>
                            
                            <td>
                                <button onClick={() => decrementCartItemQuantity(item.medName)}>-</button>
                                {item.dose}
                                <button onClick={() => updateCartItemQuantity(item.medName)}>+</button>
                            </td>

                            <td>{item.quantity}
                            
                            </td>
                            <td>{item.note}</td>
                            <td><button onClick={() => deleteMedicineFromPrescription(item.medName)}>Delete</button></td>


                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => updateMedicineFromPrescription(prescriptionId)}>Update</button>
           

            
        </div>
    );
};

export default updatePrescription;
