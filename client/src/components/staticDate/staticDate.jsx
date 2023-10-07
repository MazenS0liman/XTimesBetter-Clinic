import React from "react";

// Styles
import styles from './staticDate.module.css';

// Hooks
import { useState } from "react";

// MUI Components
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export const StaticDate = ({ date, setDate }) => {
        
    return(
        <div className={styles['staticdate-main-div']}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                    components={[
                        'MobileDatePicker',
                    ]}
                >
                    <DemoItem label="Appointment Date">
                        <MobileDatePicker onAccept={setDate}/>
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
        </div>
    );
}
