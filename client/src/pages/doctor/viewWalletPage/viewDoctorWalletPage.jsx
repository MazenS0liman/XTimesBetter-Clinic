import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './WalletDrInfo.module.css'; // Import your CSS for styling
import moneyImage from '../../../assets/img/money.png';

// React Router DOM
import { useNavigate } from 'react-router-dom';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';

const ViewDoctorWalletPage = () => {
    const { accessToken } = useAuth();
    const [walletNumber, setWalletNumber] = useState(null);
    const navigate = useNavigate();

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
        })
        .catch((error) => {
          navigate('/');
        });
    }

    checkAuthentication();

    useEffect(() => {
        const fetchWalletDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctor/viewWalletNumber', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });

                if (response && response.data) {
                    setWalletNumber(response.data);
                }
            } catch (error) {
                console.error('Error fetching wallet number:', error);
            }
        };

        fetchWalletDetails();
    }, []);

    return (
        <div>
          <h1>Wallet Amount</h1>
          <div className={styles.walletContainer}>
            <div className={styles.walletAmount}>
            <p className={styles.largeText}>Your Balance: ${walletNumber} EGP </p>
            <div className={styles.walletAmount}>
              <img src={moneyImage} alt="Money Icon" className={styles.moneyIcon} />
            </div>
              {/* <p className={styles.largeText}>${walletNumber}</p> Display the wallet amount here with larger text */}
            </div>
            <br />
            <br />
           
          </div>
        </div>
    );
};
    

export default ViewDoctorWalletPage;
