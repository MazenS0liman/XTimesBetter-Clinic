function unsuccessPayment() {

    const handleSubmit = () => {
        window.location.href="http://localhost:5173/patient/";

    };

    return (
        <div className="Success Payment">
            <h2>Unsuccessful Payment</h2>
            <button onClick={() => handleSubmit()}>Proceed</button>
        </div>

    );

}

export default unsuccessPayment; 