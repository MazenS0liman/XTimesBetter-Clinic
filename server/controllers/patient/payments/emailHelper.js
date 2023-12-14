const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service : 'gmail',
    port: 465,
    secure: true, 
    auth : {
       user: 'notificationsCenterX10@gmail.com',
       pass: 'mlwyqxpwqleithmj' 
    },
});

async function sendEmail(email, emailSubject, emailText) {
    const mailOptions = {
        from: 'notificationsCenterX10@gmail.com',
        to: email,
        subject: emailSubject,
        text: emailText,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending email to ${email}: ${error}`);
        } else {
            console.log(`Email sent to ${email}: ${info.response}`);
        }
    });
}

module.exports = { sendEmail };