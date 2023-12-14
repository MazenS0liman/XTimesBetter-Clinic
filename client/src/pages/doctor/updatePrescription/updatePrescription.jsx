import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import deleteIcon from '../../../assets/img/delete-Icon.png'; // Adjust the path accordingly
import styles from './updatePrescription.module.css'
//const prescriptionId = '65668660eb56032a95d0010e'
const updatePrescription = () => {
  const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const { prescriptionId } = useParams();
   // console.log("ana hena",prescriptionId);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
              const response = await axios.get(`http://localhost:5000/doctor/updatePrescriptions/getPrescriptionById/${prescriptionId}`);
              
              setCartItems(response.data);
              //console.log("cartitems:", cartItems)
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        // Call the function to fetch cart items
        fetchCartItems();
    }, [prescriptionId]);


    
  // Log cartItems whenever it changes
  useEffect(() => {
    console.log("cartitems:", cartItems);
  }, [cartItems]);

    /*const updateCartItemQuantity = (medName) => {
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
      };*/
    
      const deleteMedicineFromPrescription = (medName) => {
        // Send a DELETE request to delete a cart item
        axios.delete(`http://localhost:5000/doctor/updatePrescriptions/deleteMedicineFromPrescription/${medName}`, { data: { medName, cartItems } })
          .then(() => {
            setCartItems(cartItems.filter((item) => item.medName !== medName));
           // console.log("after deletion--", cartItems.filter((item) => item.medName !== medName))
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems.filter((item) => item.medName !== medName))); 
          })
          .catch((error) => console.error('Error deleting item:', error));
      };

      const handleNoteChange = (index, event) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].dosage = event.target.innerText;
        setCartItems(updatedCartItems); // Update the state with the updated array
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
       // console.log("should be sent cartItems:", updatedCartItems);
      };
      

      /*const updateMedicineFromPrescription = (prescriptionId) => {
        axios.put(`http://localhost:5000/doctor/updatePrescriptions/updatePrescription/${prescriptionId}/${medName}/${dosage}`)
            .then(() => {
                // Update the cart items on the frontend after a successful update
                setCartItems(cartItems.filter((item) => item.medName !== prescriptionId));
                console.log("updated cart items:",cartItems)
    
                // Update the stored cart items in sessionStorage
                sessionStorage.setItem('cartItems', JSON.stringify(cartItems.filter((item) => item.medName !== prescriptionId)));
                alert("Prescription Updated SUCCESSFULLY")
                navigate('/doctor/PrescriptionDoctorTable')
                sessionStorage.removeItem('cartItems')
            })
            .catch((error) => console.error('Error updating prescription:', error));
    };*/
    /*const updateMedicineFromPrescription = async (prescriptionId, medName, newDosage) => {
      try {
        await axios.put(`http://localhost:5000/doctor/updatePrescriptions/updateMedicineDosage/${prescriptionId}/${medName}/${newDosage}`);
        alert("Medicine Dosage Updated SUCCESSFULLY");
        // Optionally, you can navigate or perform any other actions after a successful update.
      } catch (error) {
        console.error('Error updating medicine dosage:', error);
        // Handle the error, e.g., show a user-friendly message.
      }
    };*/

   
    const updateMedicineFromPrescription = async (prescriptionId, cartItems) => {
      try {
        //console.log("eh elle bytb3t");
        //console.log(prescriptionId);
        //console.log(cartItems);
        // Send a PUT request to update the prescription
        axios.put(`http://localhost:5000/doctor/updatePrescriptions/updatePrescription/${prescriptionId}`, { cartItems });

    
        // Update the cart items on the frontend after a successful update
        setCartItems([]);
    
        // Update the stored cart items in sessionStorage
        sessionStorage.removeItem('cartItems');
    
        alert("Prescription Updated SUCCESSFULLY");
        navigate('/doctor/PrescriptionDoctorTable');
      } catch (error) {
        console.error('Error updating prescription:', error);
        // Handle the error, e.g., show a user-friendly message.
      }
    };
    
  

  

    




    
  
   
  
    return (
      <div>
        <br/>
        <h2>Update Prescription</h2>
        <br/>

        <table className={styles.pharmacistTable}>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dose</th>
              <th>Delete</th>
            
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>{item.medName}</td>
                <td contentEditable="true" onBlur={(e) => handleNoteChange(index, e)}>{item.dosage}</td>
                
                <td><button className={styles["button-delete"]} onClick={() => deleteMedicineFromPrescription(item.medName)}>
              <img src={deleteIcon} alt="Delete" style={{ width: '40px', height: '40px' }} />
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => updateMedicineFromPrescription(prescriptionId, cartItems)}
           className={styles["Updatebutton"]}
           >
            Done
        </button>
  
      
      </div>
    );
  };
  
export default updatePrescription;
