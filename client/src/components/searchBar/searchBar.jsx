// Styles
import styles from './searchBar.module.css';

// Hooks
import { useRef } from 'react';

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

export const SearchBar = ({handleSearch, handleFilterClick}) => {
    const inputRef = useRef("");

    function handleChange (event) {
        inputRef.current = event.target.value;
        handleSearch(inputRef.current);
    }

    function handleClick() {
        handleSearch(inputRef.current);
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
                        <FontAwesomeIcon icon={faFilter} />
                    </button>
                </div>
            </div>
        </div>
    )
}
