import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PackagePayment() {

    const location = useLocation();
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState(null);


    //To test
/*     const receivedInfo = {
        package_name: "Silver", // package_name
        priceAfter: 1,
        paying_username: "ali"  // paying_username
    }; */

    const receivedInfo = {
        patient_username: location.state.patient_username,   
        paying_username: location.state.paying_username,  
        package_name: location.state.package_name,
        priceBefore : location.state.priceBefore,
        priceAfter: location.state.priceAfter,
        isExistingPatient: location.state.isExistingPatient
    };


    // const receivedInfo = {
    //     patient_username: location.state.patient_username,   
    //     paying_username: location.state.paying_username,  
    //     package_name: location.state.package_name,
    //     priceBefore : location.state.priceBefore,
    //     priceAfter: location.state.priceAfter,
    //     isExistingPatient: isExistingPatient
    // };
   

    const handleButtonClick = (buttonId) => {
        // Update the selected button in the component's state
        setSelectedButton({ selectedButton: buttonId });
        handleSubmit(buttonId);
    };

    const handleSubmit = async (buttonId) => {

        if (buttonId === "creditCard") {

            fetch('http://localhost:5000/patient/packagePaymentCreditCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(receivedInfo)

            }).then(res => {
                return res.json();
            }).then((data) => {
                window.location = data.url;
            })
        }

        if (buttonId === "wallet") {
            try {
                console.log(receivedInfo);
                fetch('http://localhost:5000/patient/packagePaymentWallet', {
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
                    console.log(data.packObject);
                    if (data.success) {
                        navigate('/patient/successPackPayWallet', {state:{ packObject: data.packObject}})

                       // window.location = 'http://localhost:5173/patient/successPackPayWallet';
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
    return (
        <div className="payment">
            <div className="receipt-container">
                <h2>Receipt</h2>
                <div>
                    <strong>Package: </strong> {receivedInfo.package_name}
                </div>
                <div>
                    <strong>Price: </strong> {receivedInfo.priceAfter}
                </div>
            </div>
            <h3>Choose payment Method</h3>
            <button
                id="wallet"
                className={selectedButton === 'wallet' ? 'selected' : ''}
                onClick={() => handleButtonClick('wallet')}
            >
                Wallet
            </button>
            <button
                id="creditCard"
                className={selectedButton === 'creditCard' ? 'selected' : ''}
                onClick={() => handleButtonClick('creditCard')}
            >
                Credit Card
            </button>
        </div>
    );
}

export default PackagePayment; 