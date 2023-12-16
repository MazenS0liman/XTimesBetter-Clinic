# XTimesBetter-Clinic

## Motivation
In the dynamic landscape of healthcare, the El7a2ny Virtual Clinic emerges as a pioneering solution, dedicated to transforming the interactions between clinics, doctors, and patients. This project is a software solution tailored for clinics and medical practitioners, facilitating a streamlined and automated approach to healthcare processes.

## Build Status
This project does not currently use a continuous integration service. If you encounter any issues during setup, please refer to the installation instructions and feel free to reach out for assistance.

## Code Style
Currently, our project doesn't have a formalized code style guide in place. While we strive for code readability and maintainability, we understand that consistency is crucial for collaborative development.
In the absence of a formal guide, we encourage contributors to follow general best practices for code readability and to maintain consistency within the codebase.


## Screenshots
- ![Screenshot 1](link-to-screenshot-1)
- ![Screenshot 2](link-to-screenshot-2)


## Tech/Framework used
- [React.js](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Node.js](https://nodejs.org/) - JavaScript runtime for server-side development
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - A NoSQL database for storing application data
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
- [Axios](https://axios-http.com/) - Promise-based HTTP client for the browser and Node.js
- [React Router](https://reactrouter.com/) - Declarative routing for React.js applications

## Features

### Registration 
1. *User Registration:*
   - Users can register for an account, providing necessary information.
   - Account registration ensures secure and personalized access to the clinic system.
   
2. *Doctor's Request:*
   - Doctor candidates can submit a request form.
   - Admin reviews and approves qualified requests, creating Doctors' accounts.

### Login
1. *Users Login:*
   - Registered users can log in as patients, gaining access to personalized features.
2. *Users Logout:*
   - Logged in users can log out to keep their account and not reachable by everyone. 
   
  

### Admin Account

#### Account Details
1. *View Profile:*
   - Admins can view and update their personal information.

2. *Change Password:*
   - Admins have the option to change their account password for security reasons.

3. *Reset Password:*
   - Admins have the option to reset password if they forgot it.
   
#### Admin's Management
4. *Add Another Admin Account:*
   - Admins have the authority to add another admin account, granting administrative privileges.

5. *Remove User Accounts:*
   - Admins can remove patient accounts, admin accounts, and doctors accounts as needed.

#### Doctor's Management
6. *View Doctors' Requests:*
   - Admins can view incoming doctors requests, containing submitted information.

7. *Accept/Reject Doctor's Requests:*
   - Admins have the ability to review and accept/reject doctor's requests based on submitted information.
   - Accepted doctors become eligible to log in to the system.

#### Package Management
8. *View Packages List:*
   - Admins can access a comprehensive list of all Health Packages.
9. *Add New Health Package:*
   - Admins can add a new Health Package specifiying it's :
    a)Name
    b)Price
    c)Doctor Discount
    d)Medicine Discount
    e)Family Discount
10. *Edit/Delete Exisiting Health Package:*
    - Admins can edit any paramter of existing Health Package.
    - Admin can delete an exisiting Health Package.
   
### Doctor Account
#### Employment Contract
1. View Employment Contract:
   - Doctors can view the employment contract after the admin accept and have the option to accept/reject the contract.

#### Account Details
2. View Profile:
   - Doctors can view their personal information and update their email, hourly rate or affiliation (hospital)  .

3. Change Password:
   - Doctors have the option to change their account password for security reasons.

4. Reset Password:
   - Doctors have the option to reset password if they forgot it.
   
5. Wallet Amount:
   - Doctors can see their wallet amount which gets updated when:
     a) Appointment is reserved.
     b) monthly salary be available.

#### Patients' List
6. View All patients:
   - View a list of my patients along with their name, gender, mobile.

7. Search/Filter patients' List:
   - Search for a patient by name .
   - Filter  a patient based on upcoming appointments or start and end date of the appointments.
   - Select a patient from the search/filter results and view his detailed info .

#### Medical Background
 8. Medical History:
    - Doctors can view documents uploaded by patients for their medical history. 
 9. Health Records: 
     - Doctors can view uploaded Health Records by their patients, patients who had at least one appointment with the doctor.
     - Doctors can upload Health Records to their patients, patients who had at least one appointment with the doctor.

### Appointments
10. Appointments Slots: 
    - After doctors accept the contract, they can add available time slots for their appointments. 
   
11. View Appointments : 
    - Doctors can view a list of all their upcoming / past appointments.
    - Reschedule an appointment on another date if the old date doesn't fit me anymore
    - Cancel an appointment and recieving refunds if the cancel was more than 24 hours before the appointment
    - Patients can filter appointments by :
    a) date 
    b) status (upcoming, completed, cancelled, rescheduled)

#### Follow Ups
12. Request Follow Up:
    - Doctors can request a follow-up to a previous appointment.
    
13. Accept/Revoke a Follow Up:
    - Doctors can accept/revoke a requested follow-up that the patient requested to a previous appointment.

#### Prescriptions
14. View All Prescriptions:
    - View a list of all new and old prescriptions that doctors prescribed for their patients.
    - Filter list of prescriptions according to :
      a)date
      b)filled or unfilled


15. Select ceratin Prescription :
    - View the details of the selected prescription
    - Download selected prescription in PDF format to have it saved on their devices.

16. Add Prescription: 
    - Doctor is be able to add a prescription to a patient prescription if the there is at least one completed appointment between them.
    - Doctor is able to add medicine and for every medicine that is added to prescription docor is able to add dosage to it .
    
17. Update Prescription: 
    - Doctor is able to update prescription if the prescription is not filled by patient by adding/deleting medicine or update dosage of medicine .
    

#### Communication
18. Notifications:
    - Doctor recieves notifications on the system/by mail on multiple occasions to remain updated :
    a)Booked Appointments
    b)Cancelled/Rescheduled Appointments

19. Chats:
    - Doctors can start conversation with patients that they had appointments with

20. Video Calls:
    - Doctors can start video calls with their patients to conduct their booked appointment.


### Patient Account

#### Account Details
1. *View Profile:*
   - Patients can view and update their personal information.

2. *Change Password:*
   - Patients have the option to change their account password for security reasons.

3. *Reset Password:*
   - Patients have the option to reset password if they forgot it.
   
4. *Wallet Amount:*
   - Patients can see their wallet amount which they use in multiple occassions :
     a)Pay for Appointment
     b)Subscribe in Health Package
     c)Buy a Prescription
     d)Recieve Refunds of cancelled appointments 

#### Medical Background
 6. *Medical History:*
    - Patients can Upload or Remove documents (PDF,JPEG,JPG,PNG) for their medical history which they are accessable by their doctors 
 7. *Health Records:* 
     - Patients can Upload and View their uploaded Health Records which they are accessable by their doctors 

 
#### Doctors' List
8. *View All Doctors:*
   - View a list of all doctors along with their speciality, session price.

9. *Search/Filter Doctors' List:*
   - Search for a doctor by name and/or speciality .
   - Filter  a doctor by speciality and/or availability on a certain date and at a specific time.
   - Select a doctor from the search/filter results and view his detailed info including specilaty, affiliation (hospital), educational background .
   - View available time slots of the selected doctor.


#### Appointments with Doctors
10. *View all Appointments:*
    - Patients can access a comprehensive list of available appointments where he/she can filter based on :
   a)date 
   b)doctor's name.

11. *Book an Appointment:*
    - Patients can book an Appointment with certain doctor according to the doctor's available time slots .
    - Patients choose to pay for their appointment using wallet or credit card.

12. *View my Appointments:*
    - Patients can view a list of all my upcoming / past appointments.
    - Reschedule an appointment on another date if the old date doesn't fit me anymore
    - Cancel an appointment and recieving refunds if the cancel was more than 24 hours before the appointment
    - Patients can filter appointments by :
       a)date 
       b)status (upcoming, completed, cancelled, rescheduled)

#### Follow Ups
13. *Request Follow Up:*
    - Patients can request a follow-up to a previous appointment.

#### Prescriptions
14. *View All Prescriptions:*
    - View a list of all new and old prescriptions where my doctors prescribed for me.
    - Filter list of prescriptions according to :
      a)date
      b)filled or unfilled


15. *Select ceratin Prescription :*
    - View the details of my selected prescription
    - Download selected prescription in PDF format to have it saved on their devices
    - Choose to buy this prescription and pay for it's items using wallet or credit card
 

#### Health Packages
16. *Available Packages:*
     - Patients can view list of all available health package along their name,price,doctor discount , medicine discount , family discount 
      a)doctor discount : where he gets discount while booking an appointment
      b)medicine discount : where he gets when buying from the pharmacy platform
      c)family discount : it's a discount that the attached family members to the patient gets when subscribing to a package .

17. *Subscribe:* 
     - Patients can subscribe to health package to benefit from stated discounts for a whole year.
     - Patients choose to pay for their subscriptions using their wallet or credit card.
     - Patients can view the status of their health care package subscription (subscribed with renewal date/ unsubscribed/ cancelled with end date) .

18.  *Unsubscribe:*
     - Patients can cancel their subscription of certain package but yet benefit from it till the end date .
   

#### Family Members
19. *Add Family Member:*
    - Add family member using Name, National ID, Age, Gender and relation to the patient whether (child,husband,wife) where this member isn't part of our Clinic system
  
20. *Link Family Member:*
     - Link a system user as my family member using Phone number or Email and stating the relation whether (child,husband,wife).
 
21. *View Family Members:*
     - View list of all my Family members whether added or linked 


22. *Do on Behalf of Family Member:*
    - Patient can do multiple things on behalf of their linked/added family members :
    a)Book/Reschedule/Cancel an Appointment
    b)Subscribe/Unsubscribe in a Health Package
    c)Request a Follow Up

#### Communication
23. *Notifications:*
    - Patient recieves notifications on the system/by mail on multiple occasions to remain updated :
    a)Booked Appointments
    b)Cancelled/Rescheduled Appointments

24. *Chats:*
    - Patients can start conversation with doctors that they had appointments with

25. *Video Calls:*
    - Patients can start video calls with their doctors to conduct their booked appointment.

## Code Examples
Below are some code snippets to illustrate specific functionalities of the XTimesBetter Clinic project:
### Example 1 : Google Authentication for Video Calls

```javascript
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const doctorModel = require('../../models/Doctor');
const patientModel = require('../../models/Patient');
const familyModel = require('../../models/Family');

//Create an OAuth2 client with the loaded credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/calendar.events','https://www.googleapis.com/auth/calendar'];

// Function to generate a Google Meet link
const AuthenticateGoogle = async (req, res) => {
    const username = req.query.username;
    const type = req.query.type;

    const dataToPass = {
        username: username, 
        type: type,
    };

    const address = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: Buffer.from(JSON.stringify(dataToPass)).toString('base64'),
    });

    console.log(address);
    res.status(201).json(address);
}
```

### Example 2 : Password Change Code

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor.js');

const updateDoctorPassword = asyncHandler(async (req, res) => {
    const username = req.query.username;
    const currentPassword = req.query.currentPassword;
    const newPassword = req.query.newPassword;

    if (username === undefined) {
        return res.status(400).json({ message: 'Please enter a username', changePassword: false });
    }

    if (currentPassword === undefined) {
        return res.status(400).json({ message: 'Please enter the current password', changePassword: false});
    }

    if (newPassword === undefined) {
        return res.status(400).json({ message: 'Please enter the new password', changePassword: false});
    }

    const doctorResults = await doctorModel.find({username: username});
    let doctor = null;

    // check that the doctor exists in the database
    if (!doctorResults) {
        return res.status(404).json({ message: 'Doctor is not found', changePassword: false});
    }
    else {
        doctor = doctorResults[0];
    }

    // hash the current password entered by the doctor
    const passwordCorrect = await bcrypt.compare(currentPassword, doctor.password);

    // hashed current password entered does not match the password stored in the database
    if (!passwordCorrect) {
        return res.status(400).json({message: 'Current password is incorrect', changePassword: false});
    }
    else {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // hash the new password
        if (newPassword === currentPassword) {
            return res.status(400).json({message: 'Current password can not be same as the new password', changedPassword: false});
        }
        else {
            await doctorModel.findOneAndUpdate({username: username}, {password: hashedNewPassword}); // update the doctor's password
            return res.status(200).json({message: 'Password is changed successfully', changePassword: true});
        }
    }
});

module.exports = { updateDoctorPassword };
```

### Example 3 : Admin's Package Adjustment

``` javascript 
const { default: mongoose } = require('mongoose');
const packageModel = require('../../models/Package');

const addPackage = async(req,res) => {
    const{name, price ,doctor_discount,medicine_discount,family_discount}  = req.body;

    const package= await packageModel.findOne({name:name , valid : "valid"});

   
  try{

    if (!package){
        const package = await packageModel.create({name, price ,doctor_discount,medicine_discount,family_discount,valid:"valid"});
        res.status(200).json(package)
    }
    else{
      res.status(409).json({ message: 'Package already exists' });
    }
  }
  catch(error){
        res.status(400).json({error:error.message})
    }
  
  
}

const updatePackage = async (req, res) => {
  
  const updatedData = req.body;
  const oldname=req.body.oldname;
  delete updatedData.oldname

  // Function to safely trim a string or return undefined if it's not a string
  const trimString = (str) => (typeof str === 'string' ? str.trim() : undefined);

  // Check and update each attribute
  updatedData.name = trimString(updatedData.name);
  //console.log(updatedData);
 
  if (
    updatedData.name !== undefined &&
    updatedData.name === '' // Check if it's an empty string
  ) {
    delete updatedData.name; // Remove the attribute if it's empty
  }
  
  if ( updatedData.price ===''  &&  typeof updatedData.price !== 'number' ){
    delete updatedData ['price'];
  }

  if ( updatedData.doctor_discount ===''  &&  typeof updatedData.doctor_discount !== 'number' ){
    delete updatedData ['doctor_discount'];
  }

  if ( updatedData.medicine_discount ===''  &&  typeof updatedData.medicine_discount !== 'number' ){
    delete updatedData ['medicine_discount'];
  }

  if ( updatedData.family_discount ===''  &&  typeof updatedData.family_discount !== 'number' ){
    delete updatedData ['family_discount'];
  }


  try {
    // Find the package by ID and update its attributes
    const package = await packageModel.findOne({ name: oldname , valid : "valid"}); 
    const checkDup = await packageModel.findOne({ name: updatedData.name , valid : "valid"}); 

    if (!checkDup){

  if (package){
    const packageId = package._id;
    const updatedPackage = await packageModel.findByIdAndUpdate(packageId, updatedData, { new: true });



    // if (!updatedPackage) {
    //   return res.status(404).json({ message: 'Package not found' });
    // }

    res.status(200).json({ message: 'Package updated', package: updatedPackage });
  }
  else{
    return res.status(404).json({ message: 'Package not found' });
   }
   }
   else {
    return res.status(406).json({ message: 'Package Name Already Exist' });
   }
  }
  
 
   catch (error) {
    res.status(500).json({ error: 'Failed to update package', details: error.message });
  }

}


const deletePackage = async (req, res) => {

try{

    const name= req.body;
    const foundPackage = await packageModel.findOne({ name: name.name , valid : "valid"}) ;
    
    if (!foundPackage) {
      console.log('Package not found');
      res.status(404).json({ message: 'Package not found'});

    } 
    else {
       packageId = foundPackage._id;
       const deletedPackage = await packageModel.findByIdAndUpdate(packageId , {valid : "invalid"});
       res.status(200).json({ message: 'Package deleted', package: deletedPackage });
    }
}

catch(error){
    res.status(500).json({ error: 'Failed to delete package', details: error.message });
}
}



const viewPackage = async (req, res) => {
    const package = await packageModel.find({valid : "valid"});
    console.log("hiiii")
    res.status(200).json(package)
 }


module.exports = {addPackage,updatePackage,deletePackage,viewPackage};

```
### Example 4:Doctor's info 
```javascript 
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor.js');

const getDoctorInfo = asyncHandler(async (req, res) => {
    const username = req.body.username;

    if (username === undefined) {
        return res.status(400).json({ message: 'Please enter a username', doctor: null, found: false });
    }

    const doctor = await doctorModel.find({username: username});

    if (!doctor) {
        return res.status(404).json({message: 'Doctor not found', doctor: null,found: false});
    }
    else {
        return res.status(200).json({message: 'Doctor found', doctor: doctor, found: true});
    }
})

module.exports = { getDoctorInfo };
```

## Installation
To set up the XTimesBetter Clinic project on your local machine, follow these steps:

### 1. Install Visual Studio Code (VS Code)

Download and install [Visual Studio Code](https://code.visualstudio.com/download) based on your operating system.

### 2. Install Node.js

Visit [nodejs.org](https://nodejs.org/) and download the appropriate version of Node.js for your operating system. Follow the installation instructions provided.

### 3. Install Nodemon

Install Nodemon globally using npm. Open your terminal and run the following command:

bash
npm install -g nodemon

### 4. Install Required Tools and Dependencies
Make sure you have the following tools and dependencies installed on your machine:
1. *Express:*
   - Install Express globally using npm:
     bash
     npm install -g express
     

2. *Mongoose:*
   - Install Mongoose globally using npm:
     bash
     npm install -g mongoose
     

3. *React:*
   - Install React globally using npm:
     bash
     npm install -g react
     

4. *Git:*
   - Install Git globally using npm:
     bash
     npm install -g git
     

5. *Axios:*
   - Install Axios globally using npm:
     bash
     npm install -g axios
     

## API Reference
The XTimesBetter Clinic API is hosted at the following base URL:

- Base URL: http://localhost:5000

## Endpoints

### Authentication Routes
- `/login`: Handles user login.
- `/logout`: Handles user logout.
- `/authentication/checkAccessToken`: Validates user access token.
- `/authentication/getAccessToken`: Retrieves a new access token.
- `/authentication/changePassword`: Allows users to change their password.
- `/resetPassword`: Handles password reset requests.

### Patient Routes
- `/patient/allDoctors`: Retrieve a list of all doctors available for patients.
- `/patient/doctorList`: Endpoint related to the list of doctors, specific functionalities to be determined based on the implementation in `doctorListRoutes`.
- `/patient/register`: Register a new patient.
- `/patient/appointment`: Handle appointments, including scheduling, modifying, or canceling appointments.
- `/patient/prescriptionDetails`: Endpoint related to prescription details, specific functionalities to be determined based on the implementation in `prescriptionRoutes`.
- `/patient/addFamilyMember`: Add a family member to the patient's profile.
- `/patient/viewFamilyMembers`: View a list of family members associated with the patient.
- `/patient/viewAppointments`: View a list of appointments for a patient.
- `/patient/filterAppointmentsByDateForPatient`: Filter appointments based on date for a patient.
- `/patient/filterAppointmentsByStatusForPatient`: Filter appointments based on status for a patient.
- `/patient/info`: Get information about the logged-in patient using their username.
- `/patient/linkByEmail`: Link a patient with another using email.
- `/patient/linkByMobile`: Link a patient with another using a mobile number.
- `/patient/ViewPackages`: View available packages for patients.
- `/patient/ViewFamily`: View family-related information, specific functionalities to be determined based on the implementation in `packagesRoute`.
- `/patient/Subscribe`: Subscribe to a package.
- `/patient/Unsubscribe`: Unsubscribe from a package.
- `/patient/Famsubs`: View family subscriptions.
- `/patient/Allsubs`: View all subscriptions.
- `/patient/Allpatients`: View all patients.
- `/patient/Subs1`, `/patient/Subs2`: Additional endpoints related to subscriptions.
- `/patient/viewWalletNumber`: View the wallet number associated with a patient.
- `/patient/packagePaymentCreditCard`: Process credit card payments for package subscriptions.
- `/patient/packagePaymentWallet`: Process wallet payments for package subscriptions.
- `/patient/appointmentPaymentCreditCard`: Process credit card payments for appointments.
- `/patient/appointmentPaymentWallet`: Process wallet payments for appointments.
- `/patient/viewMedicalHistory`: View the medical history of a patient.
- `/patient/viewHealthRecords`: View health records of a patient.
- `/patient/chat`: Handle chat-related functionalities for patients.
- `/patient/requestFollowUp`: Request a follow-up appointment.
- `/patient/notifications`: View notifications for a patient.
- `/patient/Video`: Handle video call functionalities for patients.
- `/patient/google`: Google authentication-related functionalities for patients.

### Doctors Routes
- `/doctor/register`: Register a new doctor.
- `/doctor/patients`: Retrieve a list of patients associated with the doctor.
- `/doctor/profile`: View and manage the profile of the logged-in doctor.
- `/doctor/filterAppointmentsByDateForDoctor`: Filter appointments based on date for a doctor.
- `/doctor/filterAppointmentsByStatusForDoctor`: Filter appointments based on status for a doctor.
- `/doctor/info`: Get information about the logged-in doctor using their username.
- `/doctor/viewContract`: View contracts related to the doctor.
- `/doctor/addContract`: Add a new contract for the doctor.
- `/doctor/viewDoctors`: View information about other doctors.
- `/doctor/acceptContract`: Accept a contract offer.
- `/doctor/rejectContract`: Reject a contract offer.
- `/doctor/viewWalletNumber`: View the wallet number associated with the doctor.
- `/doctor/appointments`: View and manage appointments for the doctor.
- `/doctor/addTimeSlot`: Add available time slots for appointments.
- `/doctor/uploadHealthRecords`: Upload health records for patients.
- `/doctor/viewPHealthRecords`: View health records of patients.
- `/doctor/prescriptionDetails`: View details of prescriptions issued by the doctor.
- `/doctor/updatePrescriptions`: Update existing prescriptions.
- `/doctor/newPrescription`: Issue a new prescription.
- `/doctor/chat`: Handle chat-related functionalities for doctors.
- `/doctor/acceptRejectFollowUp`: Accept or reject follow-up requests from patients.
- `/doctor/notifications`: View notifications for the doctor.
- `/doctor/Video`: Handle video call functionalities for doctors.

### Admin Routes
- `/admin/viewREQDoctors`: View information about doctors who have requested approval.
- `/admin/removeDoctor`: Remove a doctor from the system.
- `/admin/addPackage`: Add a new package to the system.
- `/admin/updatePackage`: Update details of an existing package.
- `/admin/deletePackage`: Delete a package from the system.
- `/admin/ViewPackage`: View details of a specific package.
- `/Admin/addremove`: Additional endpoints related to adding and removing functionalities for admins.
- `/admin/info`: Get information about the logged-in admin using their username.

## Tests
These tests are performed using [Postman](https://www.postman.com/). Below are examples of API tests:
### Test 1 : Get Doctor's info using his username 
- *Route*: GET http://localhost:5000/doctor/info
- *Output*:
 ```json
 {
    "message": "Doctor found",
    "doctor": [
        {
            "nationalID": {
                "name": "nationalID-1699976632393.jpg",
                "path": "..\\server\\uploads\\nationalID-1699976632393.jpg",
                "contentType": "image/jpeg"
            },
            "medicalLicense": {
                "name": "medicalLicense-1699976632399.jpg",
                "path": "..\\server\\uploads\\medicalLicense-1699976632399.jpg",
                "contentType": "image/jpeg"
            },
            "medicalDegree": {
                "name": "medicalDegree-1699976632412.png",
                "path": "..\\server\\uploads\\medicalDegree-1699976632412.png",
                "contentType": "image/png"
            },
            "_id": "6553a33f02d3063311a254a5",
            "username": "Logy",
            "name": "Logy",
            "email": "logy@gmail.com",
            "password": "$2b$10$KksR5evi2s6ejG47ivcYB.E4j85yq2OraAT563sL3P4ESvrIfu/IO",
            "dob": "1990-08-25",
            "hourly_rate": 78,
            "affiliation": "Hospital XYZ",
            "educational_background": "MD",
            "speciality": "Cardiology ",
            "availableTimeSlots": [
                "2023-12-13T18:25:00.000Z"
            ],
            "createdAt": "2023-11-14T16:41:35.063Z",
            "updatedAt": "2023-12-15T11:25:10.275Z",
            "__v": 67,
            "walletAmount": 1039.872,
            "notifications": [
                {
                    "message": "New appointment at slot 6:41:35 PM on 18/12/2023 is reserved  ",
                    "_id": "656c73159e901938e4b75176",
                    "timestamp": "2023-12-03T12:22:45.878Z",
                    "type": "new"
                },
                {
                    "message": "New appointment at slot 8:51:29 AM on 20/12/2023 is reserved  ",
                    "_id": "656cfcf9c2155f84b07f52d0",
                    "timestamp": "2023-12-03T22:11:05.072Z",
                    "type": "new"
                },
                {
                    "type": "new",
                    "message": "New appointment at slot 12:43:53 AM on 05/12/2023 is reserved  ",
                    "_id": "657ad4ee2986db3ffadaeefd",
                    "timestamp": "2023-12-14T10:11:58.804Z"
                }
            ]
        }
    ],
    "found": true
}
```

### Test 2 : Get All available Health Packages
- *Route*: GET http://localhost:5000/patient/ViewPackages/viewP
- *Output*:
 ```json
 [
    {
        "_id": "657ae05f6f564517f5d7fbbb",
        "name": "Gold",
        "price": 222,
        "doctor_discount": 22,
        "medicine_discount": 17,
        "family_discount": 22,
        "subscribed_patients": [],
        "valid": "valid",
        "createdAt": "2023-12-14T11:00:47.546Z",
        "updatedAt": "2023-12-14T18:13:47.194Z",
        "__v": 4
    }
]
```



## How to Use?
Follow these steps to set up and use the XTimesBetter Clinic application on your local machine:

### 1. Prerequisites
Make sure you have the following installed on your machine:
- [Visual Studio Code (VS Code)](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/)
- [Nodemon](https://www.npmjs.com/package/nodemon) (Installed globally using npm install -g nodemon)

### 2. Clone the Repository
bash
git clone https://github.com/your-username/XTimesBetter-Clinic.git
cd XTimesBetter-Clinic

### 3. Install Dependencies

1. *Server Dependencies:*
   bash
   cd server
   npm install
   
 2. *Client Dependencies:*
    bash
    cd client
    npm install
    
### 4. Start Server
To run the XTimesBetter Clinic server, execute the following command in the server directory:
   bash
   cd server
   npm run dev
   
### 5. Start Client
To run the XTimesBetter Clinic client, execute the following command in the client directory:
   bash
   cd client
   npm run dev
   
Now, with both the server and client running, you can access the XTimesBetter Clinic application in your web browser at http://localhost:5173. Enjoy exploring our project!

## Contribute
We welcome contributions from the community! If you'd like to contribute to the XTimesBetter Clinic project, please follow these guidelines:

### Getting Started
1. Fork the repository and clone it to your local machine.
2. Create a new branch for your contribution: git checkout -b feature/your-feature-name.
3. Make your changes and ensure that the code follows our coding standards.

### Code Standards
- Follow the existing coding style and conventions.
- Write clear and concise commit messages.
- Keep your changes focused and avoid unrelated changes in a single pull request.

### Submitting Changes
1. Push your changes to your forked repository.
2. Create a pull request from your branch to the main repository's Sprint3 branch.

### Reporting Issues

If you encounter any bugs or issues, please open a GitHub issue. Provide detailed information about the problem and steps to reproduce it.

### Feature Requests

If you have a feature request, open a GitHub issue and describe the feature you'd like to see. We appreciate your input!



By contributing, you agree that your contributions will be licensed under our License section
Thank you for contributing to XTimesBetter Clinic! 🚀

## Credits
- https://youtu.be/98BzS5Oz5E4?si=EEcNcKYBLNBR5ZlU
- https://www.atatus.com/blog/how-to-perform-http-requests-with-axios-a-complete-guide/#:~:text=Axios
- https://youtu.be/1r-F3FIONl8
- https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA
- https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg
- https://www.youtube.com/watch?v=fgTGADljAeg
- https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY
- https://www.youtube.com/watch?v=mbsmsi7l3r4
- https://youtu.be/1r-F3FIONl8

## License

- **Stripe:**
  - [Stripe](https://stripe.com) is licensed under the [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0).

- **Google APIs:**
  - Google APIs used in this project are subject to Google's terms of service and licensing. Refer to [Google APIs Terms of Service](https://developers.google.com/terms) for more information.

- **JWT Authentication:**
  - The JWT authentication implementation is subject to the terms of the [MIT License](https://opensource.org/licenses/MIT).



