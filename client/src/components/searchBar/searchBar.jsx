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
import { faSearch, faFilter, faCalendarCheck, faFilterCircleXmark, faCalendarPlus, faCalendarMinus, faCalendar } from '@fortawesome/free-solid-svg-icons';

// Tooltip
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

export const SearchBar = ({handleSearch, handleFilterClick, handleStartDatePickerClick, handleEndDatePickerClick, handleClearSearchFilter, handleUpcomingAppointmentsClick}) => {
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
            <div className={styles['searchbar-sub-div']}>
                <div className={styles['searchbar-input-div']}>
                    <input className={styles['searchbar-input']} value={inputValue} placeholder="Search for ..." type="text" onChange={handleChange}/>
                </div>
                
                <div className={styles['searchbar-icon-div']}>
                    <button 
                        data-tooltip-id="my__search__icon"
                        data-tooltip-content="Search"
                        data-tooltip-place="top"
                        className={styles['searchbar-button']} 
                        onClick={handleClick}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>

                {/* <div className={styles['searchfilter-icon-div']}>
                    <button 
                        className={styles['searchfilter-button']} 
                        onClick={handleFilterClick}
                        data-tooltip-id="my__filter__new__icon"
                        data-tooltip-content="Filter New Appointments"
                        data-tooltip-place="top"
                    >
                        <FontAwesomeIcon icon={faCalendarCheck} />
                    </button>
                </div> */}

                <div className={styles['searchfilter-icon-div']}>
                    <button 
                        className={styles['searchfilter-button']} 
                        onClick={() => {
                            setShowStartDatePicker(!showStartDatePicker);
                            setShowEndDatePicker(false);
                         }}
                        data-tooltip-id="my__start__date__icon"
                        data-tooltip-content="Pick Start Date"
                        data-tooltip-place="top"
                    >
                        <FontAwesomeIcon icon={faCalendarPlus} />
                    </button>
                </div>

                <div className={styles['searchfilter-icon-div']}>
                    <button 
                        className={styles['searchfilter-button']} 
                        onClick={() => {
                            setShowEndDatePicker(!showEndDatePicker);
                            setShowStartDatePicker(false);
                        }}
                        data-tooltip-id="my__end__date__icon"
                        data-tooltip-content="Pick End Date"
                        data-tooltip-place="top"
                    >
                        <FontAwesomeIcon icon={faCalendarMinus} />
                    </button>
                </div>

                <div className={styles['searchfilter-icon-div']}>
                    <button 
                        className={styles['searchfilter-button']}
                        onClick={handleUpcomingAppointmentsClick}
                        data-tooltip-id="my__end__date__icon"
                        data-tooltip-content="Pick Upcoming Appointments"
                        data-tooltip-place="top"
                    >
                        <FontAwesomeIcon icon={faCalendar} />
                    </button>
                </div>

                <div className={styles['clearfilter-icon-div']}>
                    <button 
                        className={styles['clearfilter-button']} 
                        onClick={handleClearSearchFilter}
                        data-tooltip-id="my__clear__filter__icon"
                        data-tooltip-content="Clear Filters"
                        data-tooltip-place="top"
                    >
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
            <Tooltip id="my__search__icon" />
            <Tooltip id="my__filter__new__icon" />   
            <Tooltip id="my__start__date__icon" />  
            <Tooltip id="my__end__date__icon" />       
            <Tooltip id="my__filter__upcoming__icon" />   
            <Tooltip id="my__clear__filter__icon" />           
        </div>
    )
}
