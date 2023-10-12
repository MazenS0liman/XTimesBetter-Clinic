import React from 'react';

// Styles
import styles from './emergencyContactTable.module.css';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const EmergencyTable = ({ emergencies }) => {
    return (
        <div className={styles['emergency-table-div']}>
            <Typography level="h2" sx={{m: '10px', color: 'white'}}>Emergency</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%' ,}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {emergencies.map((emergency, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" align="center">{emergency.name}</TableCell>
                            <TableCell align="center">{emergency.phone}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
