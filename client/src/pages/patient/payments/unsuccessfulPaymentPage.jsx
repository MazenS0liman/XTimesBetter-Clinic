// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';

// Hooks
import { useState, useEffect } from 'react';

import styles from './payments.module.css';
import {   Button, ChakraProvider ,Box,IconButton} from '@chakra-ui/react'
import {   CloseIcon} from '@chakra-ui/icons'

function UnsuccessPayment() {

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
    

    const handleSubmit = () => {
        //window.location.href="http://localhost:5173/patient/";
        navigate('/patient/');

    };

    // return (
    //     <div className="Success Payment">
    //         <h2>Unsuccessful Payment</h2>
    //         <button onClick={() => handleSubmit()}>Proceed</button>
    //     </div>

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
                  Unsuccessful Payment
                </strong>{" "}
                <IconButton
                  isRound={true}
                  variant="solid"
                  colorScheme="red"
                  aria-label="Done"
                  size="5px"
                  icon={<CloseIcon />}
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

export default UnsuccessPayment; 