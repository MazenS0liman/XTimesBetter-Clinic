import React  from 'react';
import dayjs from 'dayjs';

// Styles
import styles from './doctorSearchBar.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faCalendarCheck, faFilterCircleXmark, faCalendarPlus, faCalendarMinus } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useRef, useState, useEffect } from 'react';

// Components
import { StaticDate } from '../staticDate/staticDate';

const searchBar = ({ onSearch, onSearch2 , onSearch3, onClear , handleDatePickerClick }) => {
    // Inputs
    const [doctorName, setDoctorName] = useState('');
    const [doctorSpeciality, setDoctorSpeciality] = useState('');
    
    // Start Date Picker
    const [staticStartDate, setStaticStartDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);

    // Start Date Picker
    useEffect(() => {
        if (staticStartDate !== null && staticStartDate.$d !== undefined) {
            setStartDate(new Date(staticStartDate.$d));
        }
    }, [staticStartDate]);

    
    useEffect(() => {
        handleDatePickerClick(startDate);
    }, [startDate]);
    

    const handleInputChange = (e) => {
        setDoctorName(e.target.value)
    }

    const handleInputChange2 = (e) => {
        setDoctorSpeciality(e.target.value)
    }

    //to handle clicking on "search button"
    const handleSearchClick = () => {
        if((!(document.getElementById("doctorNameInput").value == "") && !(document.getElementById("doctorSpecialityInput").value == "" ))) {
            onSearch3(doctorName,doctorSpeciality)
            //setDoctorName("");
            //setDoctorSpeciality("");
            console.log("I am in 1")

        } 
        else if (!(document.getElementById("doctorNameInput").value == "")) {
            onSearch(doctorName);
            console.log("I am in 2")
            //setDoctorName("");
        }
        else if (!(document.getElementById("doctorSpecialityInput").value == "")){
            onSearch2(doctorSpeciality);
            console.log("I am in 3");
            //setDoctorSpeciality("");
        }
    }

    //to handle clicking "cancel search button"
    const handleClearSearch = () => {
        onClear()
        setDoctorName('');
        setDoctorSpeciality('');
    }

    //to handle pressing "enter" to search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' ){
            if (!(document.getElementById("doctorNameInput").value == ""  && !(document.getElementById("doctorSpecialityInput").value == ""))) {
                onSearch3(doctorName,doctorSpeciality)
            }
            else if (!(document.getElementById("doctorNameInput").value == "")) {
                onSearch(doctorName)
            }
            else {
                onSearch2(doctorSpeciality)
            }
        } 
    }

    


    return (
        <div className={styles["search-container"]}>
            <button className={styles["clear-button"]} onClick={handleClearSearch}>Clear Search</button>
            <br></br>
            <br></br>
            <input id = "doctorNameInput" className={styles["search-bar"]} type="text" placeholder='Doctor Name' value={doctorName} onChange={handleInputChange} onKeyPress={handleKeyPress} />
            <br></br>
            <br></br>
            <input id = "doctorSpecialityInput" className={styles["search-bar"]} type="text" placeholder='Doctor Speciality' value={doctorSpeciality} onChange={handleInputChange2} onKeyPress={handleKeyPress} />
            <br></br>
            <br></br>
            <button className={styles["search-button"]} onClick={handleSearchClick}>Search</button>
        </div>
    );

}

export default searchBar