import React from 'react';
import dayjs from 'dayjs';

// Styles
import styles from './searchBar.module.css';

// Hooks
import { useRef, useState, useEffect } from 'react';

// Components
import { StaticDate } from '../staticDate/staticDate';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faCalendarCheck, faFilterCircleXmark, faCalendarPlus, faCalendarMinus } from '@fortawesome/free-solid-svg-icons';

export const SearchBar = ({handleSearch, handleFilterClick, handleStartDatePickerClick, handleEndDatePickerClick, handleClearSearchFilter}) => {
    // Input
    const [inputValue, setInputValue] = useState("");

    // Search Button
    const [searchButtonClicked, setSearchButtonClicked] = useState(false);

    // Start Date Picker
    const [staticStartDate, setStaticStartDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);

    // End Date Picker
    const [staticEndDate, setStaticEndDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(new Date());
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Start Date Picker
    useEffect(() => {
        if (staticStartDate !== null && staticStartDate.$d !== undefined) {
            setStartDate(new Date(staticStartDate.$d));
        }
    }, [staticStartDate]);

    useEffect(() => {
        handleStartDatePickerClick(startDate);
    }, [startDate]);

    // End Date Picker
    useEffect(() => {
        if (staticEndDate !== null && staticEndDate.$d !== undefined) {
            setEndDate(new Date(staticEndDate.$d));
        }
    }, [staticEndDate]);

    useEffect(() => {
        handleEndDatePickerClick(endDate);
    }, [endDate]);

    useEffect(() => {
        if (!searchButtonClicked) {
            handleSearch(inputValue);
        }

        return () => setSearchButtonClicked(false);
    }, [inputValue]);

    function handleChange(event) {
        setInputValue(event.target.value);
    }

    function handleClick() {
        handleSearch(inputValue);
        setSearchButtonClicked(true);
        setInputValue("");
    }

    function handleSubmit(event) {
        event.preventDefault();
        handleSearch(inputValue);
        setInputValue("");
    }

    return (
        <div className={styles['searchbar-main-div']}>
            <a>Search for your patient</a>
            <div className={styles['searchbar-sub-div']}>
                <div className={styles['searchbar-input-div']}>
                    <input className={styles['searchbar-input']} value={inputValue} placeholder="Search for ..." type="text" onChange={handleChange}/>
                </div>
                
                <div className={styles['searchbar-icon-div']}>
                    <button className={styles['searchbar-button']} onClick={handleClick}>
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>

                <div className={styles['searchfilter-icon-div']}>
                    <button className={styles['searchfilter-button']} onClick={handleFilterClick}>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                    </button>
                </div>

                <div className={styles['searchfilter-icon-div']}>
                    <button className={styles['searchfilter-button']} onClick={() => setShowStartDatePicker(!showStartDatePicker)}>
                        <FontAwesomeIcon icon={faCalendarPlus} />
                    </button>
                </div>

                <div className={styles['searchfilter-icon-div']}>
                    <button className={styles['searchfilter-button']} onClick={() => setShowEndDatePicker(!showEndDatePicker)}>
                        <FontAwesomeIcon icon={faCalendarMinus} />
                    </button>
                </div>

                <div className={styles['clearfilter-icon-div']}>
                    <button className={styles['clearfilter-button']} onClick={handleClearSearchFilter}>
                        <FontAwesomeIcon icon={faFilterCircleXmark} />
                    </button>
                </div>
                
                {showStartDatePicker && (
                    <div className={styles['searchfilter-date-div']}>
                        <StaticDate label={"Start Appointment Date"} date={staticStartDate} setDate={setStaticStartDate} />
                    </div>
                )}

                {showEndDatePicker && (
                    <div className={styles['searchfilter-date-div']}>
                        <StaticDate label={"End Appointment Date"} date={staticEndDate} setDate={setStaticEndDate} />
                    </div>
                )}
            </div>
        </div>
    )
}
