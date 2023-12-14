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



// ... (imports)

// ... (other imports)

const searchBar = ({ onSearch, onSearch2, onClear, handleDatePickerClick }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchClick = async () => {
        const query = searchQuery;
    
        if (query) {
            try {
                const searchResults = await onSearch(query);
                console.log("Searchr Results :", searchResults);
                if (searchResults && searchResults.length > 0) {
                    console.log("search by name");
                } else {
                    await onSearch2(query);
                    console.log("search by speciality");
                }
            } catch (error) {
                console.error("Error in handleSearchClick:", error);
            }
        }
    
        setSearchQuery('');
    };
    
    
    

    const handleClearSearch = () => {
        onClear();
        setSearchQuery('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className={styles['search-container']}>
            <button className={styles['clear-button']} onClick={handleClearSearch}>
                Clear Search
            </button>
            <br />
            <br />
            <input
                id="searchInput"
                className={styles['search-bar']}
                type="text"
                placeholder='Search by Doctor Name or Speciality'
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
            <br />
            <br />
            <button className={styles['search-button']} onClick={handleSearchClick}>
                Search
            </button>
        </div>
    );
};

export default searchBar