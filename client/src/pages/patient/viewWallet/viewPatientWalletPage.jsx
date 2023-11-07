import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './WalletInfo.module.css'; // Import your CSS for styling
import moneyImage from '../../../assets/img/money.png';

const ViewPatientWalletPage = () => {
    const [walletNumber, setWalletNumber] = useState(null);

    useEffect(() => {
        const fetchWalletDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/patient/viewWalletNumber', {
                    headers: {
                        'Content-Type': 'application/json',
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
            <p className={styles.largeText}>Your Balance: ${walletNumber} </p>
              {/* <p className={styles.largeText}>${walletNumber}</p> Display the wallet amount here with larger text */}
            </div>
            <br />
            <br />
            <div className={styles.walletAmount}>
              <img src={moneyImage} alt="Money Icon" className={styles.moneyIcon} />
            </div>
          </div>
        </div>
    );
};
    

export default ViewPatientWalletPage;
