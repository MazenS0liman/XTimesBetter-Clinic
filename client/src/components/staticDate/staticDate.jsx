import React from "react";

// Styles
import styles from './staticDate.module.css';

// MUI Components
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export const StaticDate = ({ label, date, setDate }) => {
        
    return(
        <div className={styles['staticdate-main-div']}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                    components={[
                        'MobileDatePicker',
                    ]}
                >
                    <DemoItem label={label} >
                        <MobileDatePicker onAccept={setDate}/>
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
        </div>
    );
}