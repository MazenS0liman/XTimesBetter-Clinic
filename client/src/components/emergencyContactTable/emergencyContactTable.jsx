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

export const EmergencyTable = ({ emergency_contact }) => {
    console.log("Emergency Table");
    console.log(emergency_contact);

    return (
        <div className={styles['emergency-table-div']}>
            <Typography level="h2" sx={{m: '10px', color: 'white'}}>Emergency Contact</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%' ,}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Relation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" align="center">{emergency_contact.name}</TableCell>
                                <TableCell align="center">{emergency_contact.mobile}</TableCell>
                                <TableCell align="center">{emergency_contact.relation}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
