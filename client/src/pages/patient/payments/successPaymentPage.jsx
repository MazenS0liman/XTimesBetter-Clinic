import {useLocation }from "react-router-dom";
function SuccessPayment(){
    
    const handleSubmit =()=>{
        window.location.href = 'http://localhost:5173/patient/';
    }
    return( 
        <div className="Success Payment">
        <h2>Success Payment</h2>
        
        <button onClick={() => handleSubmit()}>Proceed</button>
    </div>
    
    );

}
function SuccessPackagePaymentWallet(){
    const location= useLocation();
    const packObject= location.state.packObject;

    console.log("In success package payment bt wallet: ", packObject);
    
    const handleSubmit =()=>{
        // Call subscribe2
        window.location.href = 'http://localhost:5173/patient/';
    }
    return( 
        <div className="Success Payment">
        <h2>Success Payment</h2>
        <button onClick={() => handleSubmit()}>Proceed</button>
    </div>
    );

}

export { SuccessPayment, SuccessPackagePaymentWallet}; 
