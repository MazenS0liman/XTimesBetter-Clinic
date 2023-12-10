import React from 'react';

// Styles
import styles from './appointmentTable.module.css';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const AppointmentTable = ({ appointments }) => {
    return (
        <div className={styles['appointment-table-div']}>
            <Typography level="h2" sx={{m: '10px', color: 'white'}}>Appointments</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%' ,}} aria-label="simple table">
                    <TableHead sx={{"& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}>
                        <TableRow sx={{"& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}>
                            <TableCell align="center" sx={{"& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}>Date</TableCell>
                            <TableCell align="center" sx={{"& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}>Status</TableCell>
                           {/*  <TableCell align="center">Reschedule</TableCell>
                            <TableCell align="center">Delete</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{"& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}>
                    {appointments.map((appointment, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, "& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}
                        >
                            <TableCell component="th" scope="row" align="center" sx={{"& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}>{appointment.date}</TableCell>
                            <TableCell align="center" sx={{"& .MuiDataGrid-row:hover": {backgroundColor: "inherit"}}}>{appointment.status} </TableCell>
                            {/* <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell> */}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
