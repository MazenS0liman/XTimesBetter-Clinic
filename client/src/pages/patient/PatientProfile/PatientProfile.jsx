import * as React from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './PatientProfile.module.css';

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

// User Defined Components
import { CreditCard } from '../../../components/creditCard/creditCard';
import { ShowCard } from '../../../components/showCard/showCard';
import { ProfileCard } from '../../../components/profileCard/profileCard';
import { Modal } from '../../../components/modalCard/modalCard';

// MUI Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AddLinkIcon from '@mui/icons-material/AddLink';
import PhonelinkRingIcon from '@mui/icons-material/PhonelinkRing';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

// Pages
import HealthRecords from '../ViewHealthRecordsPage/viewhealthRecordsPage';
import LinkPatientWithAnotherByEmail from '../LinkPatientWithAnother/LinkPatientWithAnotherByEmail';
import LinkPatientWithAnotherByMobile from '../LinkPatientWithAnother/LinkPatientWithAnotherByMobile';
import AddFamilyMember from '../AddFamilyMember/AddFamilyMember';
import viewMedicalHistory from '../viewMedicalHistory/viewMedicalHistory';
import FamilyView from '../PatientHome/PatientHome';
import ViewPatientWalletPage from '../viewWallet/viewPatientWalletPage';

export const PatientProfile = () => {
    // User Info
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDOB] = useState('');
    const [mobile, setMobile] = useState('');
    const [image, setImage] = useState('');
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
              'User-type': 'patient',
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

    function handleViewMedicalHistory() {
      navigate('/patient/viewMedicalHistory');
    }

    function handleViewSubscriptions() {
      console.log('hello world')
      navigate('/patient/ViewSubscribedPackages');
    }
    
    const getPatientInfo = async () => {
      await axios ({
        method: 'get',
        url: `http://localhost:5000/patient/info`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken,
        },
      })
      .then((response) => {
        const patient = response.data.patient[0];

        // Choosing image based on the gender of the patient 
        if (patient !== null && patient.gender === 'male') {
          setImage(manImage);
        } else {
          setImage(womenImage);
        }

        if(patient) {
          // Split the patients name string into an array of strings whenever a blank space is encountered
          const arr = patient.name.split(" ");
          // Loop through each element of the array and capitalize the first letter.
          for (let i = 0; i < arr.length; i++) {
              arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
          }
          // Join all the elements of the array back into a string 
          // using a blankspace as a separator 
          patient.name = arr.join(" ");
        }

        setName(patient.name);
        setEmail(patient.email);
        setMobile(patient.mobile);
        setDOB(patient.dob);
      })
      .catch((error) => {
        console.log(error);
      })
    };
 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    getPatientInfo();

    return (
        <div className={styles['patient-info-main-div']}>
          <div className={styles['patient-info-top-div']}>
            <div className={styles['patient-info-left-div']}>
              <img className={styles['patient-info-img']} src={image}></img>
            </div>
            <div className={styles['patient-info-right-div']}>
              <div className={styles['patient-information-div']}>
                <Typography level="h1" component="h1" sx={{color: 'black'}}>{name}</Typography>
                {/* <div className={styles['patient-information-sub-div']}>
                  <div className={styles['patient-information-left-div']}>
                    <Typography level="title-sm" sx={{color: 'white'}}>username: {username}</Typography>
                    <Typography level="title-sm" sx={{color: 'white'}}>email: {email}</Typography>
                  </div>
                  <div className={styles['patient-information-right-div']}>
                    <Typography level="title-sm" sx={{color: 'white'}}>data of birth: {dob}</Typography>
                    <Typography level="title-sm" sx={{color: 'white'}}>mobile: {mobile}</Typography>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
         {/*  <div className={styles['patient-info-bottom-div']}>
          </div> */}
          <div className={styles['main__div']}>
          <div className={styles['middle__div']}>
              <div className={styles['charts__div']}>
              <h3 style={{color: 'black'}}>Personal Info</h3>
                <ProfileCard info={
                  [
                    {name: 'Name', value: name},
                    {name: 'Username', value: username},
                    {name: 'Email', value: email},
                    {name: 'Mobile', value: mobile},
                    {name: 'Date of birth', value: dob}
                  ]
                }></ProfileCard>
                <div className={styles['right__div']}>
                  <div className={styles['wallet__div']}>
                    <CreditCard><ViewPatientWalletPage /></CreditCard>
                  </div>
                </div>
              </div>
              
            </div>
            <div className={styles['left__div']}>
              <h3 style={{color: 'black'}}>Health</h3>
              <div className={styles['configurations__div']}>
                <ShowCard title="View Medical History" icon={<MedicalInformationIcon/>} navigate={handleViewMedicalHistory}></ShowCard>
                <Modal title="View Health Records"  showIcon={<HealthAndSafetyIcon/>} isOpen={false}><HealthRecords /></Modal>
              </div>

              <h3 style={{color: 'black'}}>Subscriptions</h3>
              <div className={styles['configurations__div']}>
                <ShowCard title="Packages" icon={<CardMembershipIcon/>} navigate={handleViewSubscriptions}></ShowCard>
                {/* <DropDown title="Change password" child={<PasswordCard />}></DropDown> */}
              </div>
              
              <h3 style={{color: 'black'}}>Family Members</h3>
              <div className={styles['configurations__div']}>
                  <Modal title="View Family Members"  showIcon={<FamilyRestroomIcon/>} isOpen={false}><FamilyView /></Modal>
                  <Modal title="Add Family Member"  showIcon={<GroupAddIcon/>} isOpen={false}><AddFamilyMember /></Modal>
                  <Modal title="Link Patient By Email"  showIcon={<AddLinkIcon/>} isOpen={false}><LinkPatientWithAnotherByEmail /></Modal>
                  <Modal title="Link Patient By Mobile"  showIcon={<PhonelinkRingIcon/>} isOpen={false}><LinkPatientWithAnotherByMobile /></Modal>
              </div>
            </div>



          </div>
        </div>
    );
}