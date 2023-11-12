const asyncHandler = require('express-async-handler');
const patients= require('../../../models/Patient');
const doctors= require('../../../models/Doctor');

const stripe = require('stripe')(process.env.STRIPE_PRIV_KEY);


const payAppointment = asyncHandler(async (req, res) => {
    try {

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        line_items: [{
            price_data: {
                currency: 'USD',
                product_data: {
                    name: 'Appointment Price: '
                },

                unit_amount: req.body.appointmentPrice * 100
            },
            quantity: 1
        },
        ],

        success_url: 'http://localhost:5173/patient/successPayment',
        cancel_url: 'http://localhost:5173/patient/unsuccessPayment'  // will change it
    })
    const registeredPatient = await patients.findOne({ username: req.body.username });
    const doctorToPay = await doctors.findOne({username: req.body.doctorUsername});

    const totalAmount = req.body.appointmentPrice;
    // console.log(totalAmount);

    if (registeredPatient) {
        // console.log(registeredPatient);


            
            const doctorAmount = doctorToPay.walletAmount+ 0.5* totalAmount;
            const updatedDoctorWallet = await doctors.findOneAndUpdate({ username: req.body.doctorUsername }, { walletAmount: doctorAmount });

            // console.log("patient amount,",newWalletAmout)
            // console.log("doctor amount,",doctorAmount)

        }
    


    return res.status(201).json({ success: true, url: session.url, successURL: session.success_url });
    } catch (error) {
        // Respond with an error message if there is an error
        return res.status(500).json({ success: false, error: 'An error occurred while creating the session.' });
    }
})

module.exports = { payAppointment };