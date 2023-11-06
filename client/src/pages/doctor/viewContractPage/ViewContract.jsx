import React, { useState, useEffect } from 'react';

const ContractView = () => {

    const [contract, setContract] = useState([]);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const fetchContract = async () => {
            const response = await fetch('http://localhost:5000/doctor/viewContract/viewContract?username=Logy');
            // console.log("anaaaaaaaaaaaa")
            const contract = await response.json();

            if (response.ok) {
                setContract(contract);
            }

        };

        fetchContract();
    }, []);


    const handleAcceptContract = async () => {
        if (!accepted) {
            const response = await fetch('http://localhost:5000/doctor/acceptContract/acceptContract?username=Logy');
            // console.log("anaaaaaaaaaaaa")
            //  const newcontract = await response.json();

            if (response.ok) {
                setAccepted(true);
                window.location.reload();
            }
            else {
                // Handle any errors from the backend
                console.error('Error accepting contract:', response.statusText);
            }
        }

    };
    // const handleAcceptContract = async () => {
    //     setShowContract(true);
    // };

    return (
        <div>
            <h1>Contract</h1>


            {contract.map((Contract) => (
                <p key={Contract._id}>
                    <h2>{Contract.doctorName}</h2>
                    <p>Employment Date: {Contract.employmentDate}</p>
                    <p>Termination Date: {Contract.terminationDate}</p>
                    <p>Doctor Fees: {Contract.doctorFees}</p>
                    <p>Markup Rate: {Contract.markupRate}</p>
                    <p>Status: {Contract.accepted ? 'Accepted' : 'Pending'}</p>
                </p>
            ))

            }

            <button
                disabled={contract.accepted}
                style={{ opacity: contract.accepted ? 0.5 : 1 }}
                onClick={contract.accepted ? null : handleAcceptContract}
            >
                Accept Contract
            </button>


        </div>
    );
};

export default ContractView;