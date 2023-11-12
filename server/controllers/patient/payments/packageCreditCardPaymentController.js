const asyncHandler = require('express-async-handler');
const patients= require('../../../models/Patient')

const stripe = require('stripe')(process.env.STRIPE_PRIV_KEY);


const payPackage = asyncHandler(async (req, res) => {
    try {
      

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',

        line_items: [{
            price_data: {
                currency: 'USD',
                product_data: {
                    name: req.body.package_name+' Package'
                },

                unit_amount: req.body.priceAfter * 100
            },
            quantity: 1
        },
        ],

        success_url: 'http://localhost:5173/patient/successPackagePay',
        cancel_url: 'http://localhost:5173/patient/unsuccessPayment'  // will change it
    })
    const registeredPatient = await patients.findOne({ username: req.body.paying_username });
  
    const totalAmount = req.body.priceAfter;
 
   
    return res.status(201).json({ success: true, url: session.url, successURL: session.success_url });
    } catch (error) {
        // Respond with an error message if there is an error
        return res.status(500).json({ success: false, error: 'An error occurred while creating the session.' });
    }
})

module.exports = { payPackage };