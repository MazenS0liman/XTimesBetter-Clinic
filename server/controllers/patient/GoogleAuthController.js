
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const doctorModel = require('../../models/Doctor');
const patientModel = require('../../models/Patient');
const familyModel = require('../../models/Family');


// Create an OAuth2 client with the loaded credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar'];


// Function to generate a Google Meet link
const AuthenticateGoogle = async (req, res) => {

  const username = req.query.username
  const type = req.query.type
  console.log(username)
  const dataToPass = {
    username: username,
    type: type,
  };

  const address = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: Buffer.from(JSON.stringify(dataToPass)).toString('base64'),
  });

  // console.log(Buffer.from(JSON.stringify(dataToPass)).toString('base64'));
  console.log(address);
  //console.log( Buffer.from(JSON.stringify(dataToPass)).toString('base64'))
  res.status(201).json(address);
}

const CallBack = async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  console.log("this is the state")
  console.log(state);

  const info = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
  console.log("this is the info")
  console.log(info);
  var reciever_email = ""
  if (info.type == 'patient') {
    const patient = await patientModel.find({ username: info.username });
    console.log(patient)
    if (patient.length > 0) {
      reciever_email = patient[0].email;
    }
    else { //she/he is family member 
      const familyPatient = await familyModel.findOne({ national_id: info.username });
      const patient = await patientModel.findOne({ username: familyPatient.patient_username })
      reciever_email = patient.email;
    }
  }
  else if (info.type == 'doctor') {
    const doctor = await doctorModel.findOne({ username: info.username });
    reciever_email = doctor.email;
  }


  console.log(reciever_email);
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);


  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Create the event in Google Calendar
  const result = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    resource: {
      summary: 'My Google Meet',
      description: 'Please join your Doctor Appointment',
      start: {
        dateTime: new Date(new Date().getTime() + 302000).toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(new Date().getTime() + 3900000).toISOString(), // Add 2 hour
        timeZone: 'America/New_York',
      },
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
        },
      },
      attendees: [
        { email: reciever_email },

        // Add more attendees as needed
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 5 }, // Email reminder 5 minutes before the meeting

        ],
      },
    },

  });


  console.log(result);
  // Extract the meeting link from the response
  const meetingLink = result.data.hangoutLink;

  // Return the meeting link
  res.redirect(302, meetingLink);

}





module.exports = { CallBack, AuthenticateGoogle };

