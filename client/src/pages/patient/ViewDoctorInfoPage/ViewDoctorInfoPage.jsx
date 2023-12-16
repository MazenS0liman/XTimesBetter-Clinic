import React, { useEffect, useState } from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './viewDoctorInfoPage.module.css';

// Components
import doctorInfo from '../../../components/doctorInfo/doctorInfo';
import doctorImage from '../../../assets/img/doctor.jpg';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from '../../../components/hooks/hook1';

const ViewDoctorInfo = () => {
  const location = useLocation();
  console.log("Location :" + location)
  const doctor = location.state;
  console.log("Doctor :", doctor)
  const navigate = useNavigate();

  const selectedDoctorUsername = location.state.doctorInfo.username;
  const selectedDoctorName = location.state.doctorInfo.name;

  const [appointments, setAppointments] = useState([]);
  const [bookAppointment, setbookAppointment] = useState("")
  //const [doctorInfo , setDoctorInfo] = useState("")
  // const currentPatient = "ahmed";
  //const [username, setUsername] = useState("");
  const hourly_rate = doctor.hourly_rate;

  //Authenticate part
  const accessToken = sessionStorage.getItem('accessToken');
  const [load, setLoad] = useState(true);
  const [username, setUsername] = useState('');


  useEffect(() => {
    if (username.length != 0) {
      setLoad(false);
    }
  }, [username]);
  async function checkAuthentication() {
    await axios({
      method: 'get',
      url: 'http://localhost:5000/authentication/checkAccessToken',
      headers: {
        "Content-Type": "application/json",
        'Authorization': accessToken,
        'User-type': 'patient',
      },
    })
      .then((response) => {
        console.log(response);
        setUsername(response.data.username);
        //setLoad(false);
      })
      .catch((error) => {
        //setLoad(false);
        navigate('/login');

      });
  }

  const xTest = checkAuthentication();

  //Authenticate part

  async function checkAuthentication() {
    await axios({
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

  useEffect(() => {
    if (username !== "" && bookAppointment !== "") {
      const stateInfo = {
        doctorUsername: selectedDoctorUsername,
        doctorName: selectedDoctorName,
        currentPatient: username,
        bookAppointment: bookAppointment,
        hourly_rate: hourly_rate
      }
      navigate('/patient/BookAppointment', { state: stateInfo });
    }
  }, [bookAppointment]);

  const getAvailableAppointments = async () => {
    const response = await fetch(`http://localhost:5000/patient/doctorList/DoctorAppointments?doctor_username=${selectedDoctorUsername}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      const formattedAppointments = data.map(appointment => {
        const dateTime = new Date(appointment); // Assuming appointment is a valid DateTime string

        const date = new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(dateTime);

        const timeSlotBegin = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZone: 'UTC', // Use UTC for the initial time
        }).format(dateTime);

        const weekday = new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
        }).format(dateTime);

        const timeSlotEnd = new Date(dateTime.getTime() + (60 * 60 * 1000));
        const timeSlotEndFormatted = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZone: 'UTC', // Use UTC for the initial time
        }).format(timeSlotEnd);

        // Combine current and next hour time
        const combinedTime = `${timeSlotBegin} - ${timeSlotEndFormatted}`;

        return {
          date,
          combinedTime,
          weekday,
          timeSlotBegin,
          appointment
        };
      });

      setAppointments(formattedAppointments);
    } else {
      throw new Error('Error getting Doctor Appointments');
    }
  };

  useEffect(() => {
    getAvailableAppointments();
  }, []);

  console.log("Appointments : ", appointments)

  function handleBookingAppointments(appointment) {
    setbookAppointment(appointment);
    console.log("book", appointment)
    // setDoctorInfo(location.state);
    // console.log("doc info" , doctorInfo)
  }

  //Authenticate
  if (load) {
    return (<div>Loading</div>)
  }

  return (
    <div className={styles['container']}>
      <div className={styles['header-container']}>
        <Button className={styles['back-button']} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
      </div>
      <div className={styles['doctor-info-container']}>
        <img src={doctorImage} alt={`${doctor.name}'s Image`} className={styles['doctor-info-img']} />
        <div className={styles['doctor-details']}>
          <div className={styles['doctor-name']}>
            <Typography className={styles['doctor-info']} level="h1">Dr. {doctor.doctorInfo.name}</Typography>
          </div>
          <div className={styles['doctor-info-details']}>
            <div className={styles['doctor-info-item']}>
              <Typography level="title-sm"><strong>Speciality: </strong> {doctor.doctorInfo.speciality}</Typography>
              <Typography level="title-sm"><strong>Affiliation: </strong>{doctor.doctorInfo.affiliation}</Typography>
            </div>
            <div className={styles['doctor-info-item']}>
              <Typography level="title-sm"><strong>Educational Background: </strong>{doctor.doctorInfo.educational_background}</Typography>
              <Typography level="title-sm"><strong>Hourly Rate: </strong>{hourly_rate.toFixed(2)} LE</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['appointments-container']}>
        <Typography level="h2">Available Appointments</Typography>
        <br></br>
        <table className={styles['appointments-table']}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.weekday}</td>
                <td>{appointment.date}</td>
                <td>{appointment.combinedTime}</td>
                <td>
                  <Button onClick={() => handleBookingAppointments(appointment)}>
                    Book Appointment
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
   
}

export default ViewDoctorInfo;