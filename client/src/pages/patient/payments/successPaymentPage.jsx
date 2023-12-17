import { useLocation } from "react-router-dom";

// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';

// Hooks
import { useState, useEffect } from 'react';

import styles from './payments.module.css';
import {   Button, ChakraProvider ,IconButton} from '@chakra-ui/react'
import {   CheckIcon} from '@chakra-ui/icons'

function SuccessPayment(){

    const [username, setUsername] = useState("");
    const [load, setLoad] = useState(false);
    const accessToken = sessionStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        if(username.length != 0) {
            setLoad(true);
        }
    }, [username]);

    async function checkAuthentication() {
      await axios ({
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
    
    const handleSubmit =()=>{
        //window.location.href = 'http://localhost:5173/patient/';
        navigate('/patient/');
    }
    // return( 
    //     <div className="Success Payment">
    //     <h2>Success Payment</h2>
        
    //     <button onClick={() => handleSubmit()}>Proceed</button>
    // </div>
    
    // );
    return (
      <div
        style={{
          backgroundColor: "#f4f4ff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChakraProvider>
          <div className={styles["form-container"]}>
            <div className={styles["bordered-container"]} style={{ maxWidth: "600px", overflowY: "auto" }}>
              <h2
                style={{
                  fontSize: "1.5em",
                  marginTop: "10px",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                <strong>
                  {" "}
                  Successful Payment
                </strong>{" "}
                <IconButton
                  isRound={true}
                  variant="solid"
                  colorScheme="green"
                  aria-label="Done"
                  size="5px"
                  icon={<CheckIcon />}
                />
              </h2>
  
              
              <div className={styles["button-container"]}>
                <Button
                  className={`${styles["button"]} `}
                  colorScheme="blue"
                  variant="solid"
                  type="button"
                  onClick={() => handleSubmit()}
                >
                  Home
                </Button>
              </div>
            </div>
          </div>
        </ChakraProvider>
      </div>
    );
}
function SuccessPackagePayment(){

    const location= useLocation();
    const packObject=JSON.parse(sessionStorage.getItem("receivedInfo"));
    console.log("packObject session", packObject);

    const [username, setUsername] = useState("");
    const [load, setLoad] = useState(false);
    const accessToken = sessionStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        if(username.length != 0) {
            setLoad(true);
        }
    }, [username]);

    async function checkAuthentication() {
      await axios ({
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

    console.log("In success package payment bt wallet: ", packObject);
    
    const handleSubmit =async()=>{
        try {
            const apiUrl = 'http://localhost:5000/patient/Subs2/subs2';
            var requestData=packObject;

            
          
            // // Prepare the request data (customize as needed)
            console.log("Pack Object",requestData);
      
            // Make the API request using the Fetch API (POST request in this example)
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
            });
            
            // Check if the request was successful (status code 200)
            if (response.ok) {
              const responseData = await response.json();
              //console.log('Success:', responseData);

              //window.location.href = 'http://localhost:5173/patient/';
              navigate('/patient/');
            } 
            else {
              console.error('API Error:', response.statusText);
            }
          } catch (error) {
            // Handle any network or other errors
            console.error('Network Error:', error);
          }
    }
    // return( 
    //     <div className="Success Payment">
    //     <h2>Success Payment</h2>
    //     <button onClick={() => handleSubmit()}>Proceed</button>
    // </div>
    // );

    return (
      <div
        style={{
          backgroundColor: "#f4f4ff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChakraProvider>
          <div className={styles["form-container"]}>
            <div className={styles["bordered-container"]} style={{ maxWidth: "600px", overflowY: "auto" }}>
              <h2
                style={{
                  fontSize: "1.5em",
                  marginTop: "10px",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                <strong>
                  {" "}
                  Successful Payment
                </strong>{" "}
                <IconButton
                  isRound={true}
                  variant="solid"
                  colorScheme="green"
                  aria-label="Done"
                  size="5px"
                  icon={<CheckIcon />}
                />
              </h2>
  
              
              <div className={styles["button-container"]}>
                <Button
                  className={`${styles["button"]} `}
                  colorScheme="blue"
                  variant="solid"
                  type="button"
                  onClick={() => handleSubmit()}
                >
                  Home
                </Button>
              </div>
            </div>
          </div>
        </ChakraProvider>
      </div>
    );

}

export { SuccessPayment, SuccessPackagePayment}; 
