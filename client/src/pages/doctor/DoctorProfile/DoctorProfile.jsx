import * as React from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './DoctorProfile.module.css';

// Images
import manImage from '../../../assets/img/male.svg';
import womenImage from '../../../assets/img/female.svg';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// User Defined Components
import { PasswordCard } from '../../../components/changePasswordCard/changePasswordCard';

// React Router DOM
import { useNavigate } from 'react-router-dom';

// Hooks
import { useState, useEffect } from 'react';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// User Defined Components
import { DropDown } from '../../../components/dropDown/dropDown';
import { CreditCard } from '../../../components/creditCard/creditCard';
import { Modal } from '../../../components/modalCard/modalCard';
import { ShowCard } from '../../../components/showCard/showCard';
import { ProfileCard } from '../../../components/profileCard/profileCard';

// MUI Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import EditIcon from '@mui/icons-material/Edit';
import ContactMailIcon from '@mui/icons-material/ContactMail';

// Pages
import AddTimeSlots from '../timeSlotsPage/timeSlots';
import ViewDoctorWalletPage from '../viewWalletPage/viewDoctorWalletPage';
import UpdateDoctorInfo from '../doctorInfoPage/updateDoctorInfo';
import ContractView from '../viewContractPage/ViewContract';

export const DoctorProfile = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDOB] = useState('');
    const [image, setImage] = useState('');
    // const {accessToken} = useAuth();
    const accessToken = sessionStorage.getItem("accessToken");
    const [username, setUsername] = useState('');
    const [load, setLoad] = useState(true);

    useEffect(() => {
      if (username.length != 0) {
        setLoad(false);
      }
    }, [username]);

    async function checkAuthentication() {
      await axios ({
          method: 'get',
          url: `http://localhost:5000/authentication/checkAccessToken`,
          headers: {
              "Content-Type": "application/json",
              'Authorization': accessToken,
              'User-type': 'doctor',
          },
      })
      .then((response) => {
          console.log(response);
          setUsername(response.data.username);
      })
      .catch((error) => {
        navigate('/login');
      });
    }

    checkAuthentication();

    if (load) {
      return(<div>Loading</div>)
    }

    const getDoctorInfo = async () => {
        await axios ({
          method: 'get',
          url: `http://localhost:5000/doctor/info`,
          headers: {
              "Content-Type": "application/json",
              'Authorization': accessToken,
          },
        })
        .then((response) => {
          const doctor = response.data.doctor[0];
  
          setImage(manImage);
  
          if(doctor) {
            // Split the patients name string into an array of strings whenever a blank space is encountered
            const arr = doctor.name.split(" ");
            // Loop through each element of the array and capitalize the first letter.
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }
            // Join all the elements of the array back into a string 
            // using a blankspace as a separator 
            doctor.name = arr.join(" ");
          }
  
          setName(doctor.name);
          setEmail(doctor.email);
          setDOB(doctor.dob);
        })
        .catch((error) => {
          console.log(error);
        })
      };

    // Get doctor info
    getDoctorInfo();

    return (
        <div className={styles['doctor-info-main-div']}>
            <div className={styles['doctor-info-top-div']}>
            <div className={styles['doctor-info-left-div']}>
                <img className={styles['doctor-info-img']} src={image}></img>
            </div>
            <div className={styles['doctor-info-right-div']}>
                <div className={styles['doctor-information-div']}>
                <Typography level="h1" component="h1" sx={{color: 'black'}}>{name}</Typography>
              </div>
            </div>
            </div>
            <div className={styles['doctor-info-bottom-div']}>
            
          <div className={styles['main__div']}>
              <div className={styles['middle__div']}>
                    <div className={styles['charts__div']}>
                      <h3 style={{color: 'black'}}>Personal Info</h3>
                      <ProfileCard info={
                        [
                          {name: 'Name', value: name},
                          {name: 'Username', value: username},
                          {name: 'Email', value: email},
                          {name: 'Date of birth', value: dob}
                        ]
                      }></ProfileCard>
                    </div>
              </div>
              <div className={styles['left__div']}>
                <h3 style={{color: 'black'}}>Settings</h3>
                <div className={styles['configurations__div']}>
                  {/* <DropDown title="change password" child={<PasswordCard />}></DropDown> */}
                  <Modal title="Add Time Slots" showIcon={<AccessTimeIcon/>} isOpen={false}><AddTimeSlots /></Modal>
                  <Modal title="Update Info" showIcon={<EditIcon/>} isOpen={false}><UpdateDoctorInfo /></Modal>
                  <Modal title="Employment Contract" showIcon={<ContactMailIcon/>} isOpen={false}><ContractView /></Modal>
                </div>
                <div className={styles['right__div']}>
                  <div className={styles['wallet__div']}>
                    <CreditCard><ViewDoctorWalletPage /></CreditCard>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
    );
}