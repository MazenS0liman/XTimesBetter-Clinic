import * as React from 'react';

// Styles
import styles from './DoctorProfile.module.css';

// Images
import manImage from '../../../assets/img/man.png';
import womenImage from '../../../assets/img/woman.png';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// React Router DOM
import { useNavigate } from 'react-router-dom';

// Home Made Hooks
import { useFetch } from '../../../components/hooks/useFetch';
import { useUsername } from '../../../components/hooks/useAuth';


export const DoctorProfile = () => {
    const navigate = useNavigate();

    return (
        <div className={styles['patient-info-main-div']}>
            <div className={styles['patient-info-top-div']}>
            <div className={styles['patient-info-left-div']}>
                <img className={styles['patient-info-img']}></img>
            </div>
            <div className={styles['patient-info-right-div']}>
                <div className={styles['patient-information-div']}>
                <Typography level="h1" component="h1">{"Doctor Name"}</Typography>
                <div className={styles['patient-information-sub-div']}>
                    <div className={styles['patient-information-left-div']}>
                    <Typography level="title-sm">username: {"Doctor Username"}</Typography>
                    <Typography level="title-sm">email: {"Doctor Email"}</Typography>
                    </div>
                    <div className={styles['patient-information-right-div']}>
                    <Typography level="title-sm">data of birth: {"Doctor DOB"}</Typography>
                    <Typography level="title-sm">mobile: {"Doctor Mobile"}</Typography>
                    </div>
                </div>
                </div>
                <div className={styles['patient-settings-div']}>
                <Button onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} /></Button>
                </div>
            </div>
            </div>
            <div className={styles['patient-info-bottom-div']}>
            </div>
        </div>
    );
}