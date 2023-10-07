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
import { faSearch, faFilter, faCalendarCheck, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

export const SearchBar = ({handleSearch, handleFilterClick, handleDatePickerClick, handleClearSearchFilter}) => {
    const [staticDate, setStaticDate] = useState(dayjs());
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const inputRef = useRef("");

    useEffect(() => {
        if (staticDate !== null && staticDate.$d !== undefined) {
            setDate(new Date(staticDate.$d));
        }
    }, [staticDate]);

    useEffect(() => {
        handleDatePickerClick(date);
    }, [date]);

    function handleChange (event) {
        inputRef.current = event.target.value;
        handleSearch(inputRef.current);
    }

    function handleClick() {
        handleSearch(inputRef.current);
        inputRef.current = "";
    }

    return (
        <div className={styles['searchbar-main-div']}>
            <a>Search for your patient</a>
            <div className={styles['searchbar-sub-div']}>
                <div className={styles['searchbar-input-div']}>
                    <input className={styles['searchbar-input']} ref={inputRef.current.value} placeholder="Search for ..." type="text" onChange={handleChange} />
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
                    <button className={styles['searchfilter-button']} onClick={() => setShowDatePicker(!showDatePicker)}>
                        <FontAwesomeIcon icon={faFilter} />
                    </button>
                </div>

                <div className={styles['clearfilter-icon-div']}>
                    <button className={styles['clearfilter-button']} onClick={handleClearSearchFilter}>
                        <FontAwesomeIcon icon={faFilterCircleXmark} />
                    </button>
                </div>
                
                {showDatePicker && (
                    <div className={styles['searchfilter-date-div']}>
                        <StaticDate date={staticDate} setDate={setStaticDate} />
                    </div>
                )}
            </div>
        </div>
    )
}
