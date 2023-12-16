import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';

import { Button, ChakraProvider, Box } from '@chakra-ui/react'
import styles from './payments.module.css';


function AppointmentPayment() {
  const location = useLocation()
  const [selectedButton, setSelectedButton] = useState(null);

  const [username, setUsername] = useState("");
  const [load, setLoad] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (username.length != 0) {
      setLoad(true);
    }
  }, [username]);

  async function checkAuthentication() {
    await axios({
      method: 'get',
      url: `http://localhost:5000/authentication/checkAccessToken`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': accessToken,
        'User-type': 'patient',
      },
    })
      .then((response) => {
        console.log(response);
        setUsername(response.data.username);
      })
      .catch((error) => {
        navigate('/login');
      });
  }
  checkAuthentication();

  if (!load) {
    return (<div>Loading</div>);
  }

  console.log('receivedInfo', location.state);
  //console.log('receivedInfo.price === receivedInfo.priceBefore',receivedInfo.price === receivedInfo.priceBefore);
  const receivedInfo = {
    appointmentDate: location.state.date,
    doctorName: location.state.doctorName,
    doctorUsername: location.state.doctor_username,
    appointmentPrice: location.state.price,
    appointmentSlot: location.state.time,
    name: location.state.name,
    patientUsername: location.state.patient_username,
    bookedUsername: location.state.booked_by,
    priceBefore: location.state.priceBefore,
    discount: location.state.discount,

  };
  // console.log("receivedInfo",receivedInfo);

  // For test
  // const receivedInfo = {
  //     appointmentDate: "11/11/2023",
  //     doctorName: "dr_jones",
  //     appointmentPrice: 1,
  //     username: "ali",
  // };


  const handleButtonClick = (buttonId) => {
    // Update the selected button in the component's state
    setSelectedButton({ selectedButton: buttonId });
    handleSubmit(buttonId);
  };

  const handleSubmit = async (buttonId) => {
    if (buttonId === "doctors") {
      navigate("/patient/viewDoctorsListPage");
    }
    // console.log("receivedInfo",receivedInfo);

    if (buttonId === "creditCard") {


      fetch('http://localhost:5000/patient/appointmentPaymentCreditCard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(receivedInfo)


      }).then(res => {
        return res.json();
      }).then((data) => {
        // console.log(data);
        if (data.success) {
          // console.log(data.url);
          // console.log(data.successURL);
          // receiptCreditCard= data.orderInfo;
          window.location = data.url;
        }
        else {

          alert(data.message);
          navigate('/patient/unsuccessPayment');
        }

      })



    }
    if (buttonId === "wallet") {
      try {
        console.log(receivedInfo);
        fetch('http://localhost:5000/patient/appointmentPaymentWallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(receivedInfo)
        }).then(res => {
          console.log(res);
          return res.json();
        }).then((data) => {
          console.log(data.success);
          if (data.success) {

            window.location = 'http://localhost:5173/patient/successPayment';
          }
          else {
            alert(data.message);
            window.location = 'http://localhost:5173/patient/unsuccessPayment';
          }

        })
      } catch {
        // alert(response.data.message);
        throw new Error('Error Occuried while payment')
      }

    }



  }
  // return (
  //     <div className="receipt-container">
  //         <h2>Appointment Receipt</h2>
  //         <div>
  //             <strong>Appointment Date:</strong> {receivedInfo.appointmentDate}
  //         </div>
  //         <div>
  //             <strong>Doctor Name:</strong> {receivedInfo.doctorName}
  //         </div>
  //         <div>
  //             <strong>Appointment Price:</strong> {receivedInfo.appointmentPrice}
  //         </div>
  //         <h2>Choose payment Method</h2>
  //         <button
  //             id="wallet"
  //             className={selectedButton === 'wallet' ? 'selected' : ''}
  //             onClick={() => handleButtonClick('wallet')}
  //         >
  //             Wallet
  //         </button>
  //         <button
  //             id="creditCard"
  //             className={selectedButton === 'creditCard' ? 'selected' : ''}
  //             onClick={() => handleButtonClick('creditCard')}
  //         >
  //             Credit Card
  //         </button>


  //     </div>
  // );
  return (
    <div style={{ backgroundColor: '#f4f4ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className={styles['form-container']}>
        <div className={styles['bordered-container']}>
          <ChakraProvider>
            <Box>
              <h2 style={{ fontSize: '1.5em', marginTop: '30px', marginBottom: '20px', textAlign: 'center' }}>
                <strong>Appointment Receipt</strong>
              </h2>
              <div>
                <strong>Appointment Date:</strong> {receivedInfo.appointmentDate}
              </div>
              <div>
                <strong>Doctor Name:</strong> {receivedInfo.doctorName}
              </div>
              <div>
                <strong>Appointment Price:</strong>
                {receivedInfo.appointmentPrice === receivedInfo.priceBefore
                  ? `${receivedInfo.appointmentPrice} LE`
                  : (
                    <>
                      <span style={{ textDecoration: 'line-through', marginRight: '5px' }}>{receivedInfo.priceBefore} LE</span>
                      <span style={{ color: 'red' }}>
                        {receivedInfo.appointmentPrice} LE (Discount: {receivedInfo.discount}%)
                      </span>
                    </>
                  )
                }
              </div>
              <h2 style={{ fontSize: '1.5em', marginTop: '20px', marginBottom: '-10px', textAlign: 'center' }}>
                <strong>Choose payment Method</strong>
              </h2>
              {/* <div className={styles['button-container']}> */}

              <Button
                className={`${styles['button']} ${selectedButton === 'wallet' ? styles['selected'] : ''}`}
                colorScheme="gray"
                variant="solid"
                type="button"
                onClick={() => handleButtonClick('wallet')}
              >
                Wallet
              </Button>
              <Button
                className={`${styles['button']} ${selectedButton === 'creditCard' ? styles['selected'] : ''}`}
                colorScheme="gray"
                variant="solid"
                type="button"
                onClick={() => handleButtonClick('creditCard')}
              >
                Credit Card
              </Button>
            </Box>

            <Button
              // className={`${styles['button']} ${selectedButton === 'creditCard' ? styles['selected'] : ''}`}
              colorScheme="blue"
              variant="solid"
              type="button"
              onClick={() => handleButtonClick('doctors')}
            >
              Back to Doctors
            </Button>

          </ChakraProvider>
        </div>
      </div>
    </div>

  );

}

export default AppointmentPayment; 