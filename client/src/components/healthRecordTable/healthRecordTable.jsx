import React from 'react';

// Styles
import styles from './healthRecordTable.module.css';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const HealthRecordTable = ({ healthRecords }) => {
    return (
        <div className={styles['health-record-table-div']}>
            <Typography level="h2" sx={{m: '10px', color: 'white'}}>Health Records</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%' ,}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Illness</TableCell>
                            <TableCell align="center">Medicine</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row" align="center"> Headache</TableCell>
                            <TableCell component="th" scope="row" align="center"> Ibuprofen</TableCell>
                            <TableCell component="th" scope="row" align="center"> 	2 tablets</TableCell>
                            <TableCell component="th" scope="row" align="center"> Every 4-6 hours</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" align="center"> Fever</TableCell>
                            <TableCell component="th" scope="row" align="center"> Acetaminophen</TableCell>
                            <TableCell component="th" scope="row" align="center"> 	1-2 tablets</TableCell>
                            <TableCell component="th" scope="row" align="center"> Every 4-6 hours</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" align="center"> Cold</TableCell>
                            <TableCell component="th" scope="row" align="center"> Cough syrup</TableCell>
                            <TableCell component="th" scope="row" align="center"> 1-2 teaspoons</TableCell>
                            <TableCell component="th" scope="row" align="center"> Every 4-6 hours</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" align="center"> Sore throat</TableCell>
                            <TableCell component="th" scope="row" align="center"> 	Throat lozenges</TableCell>
                            <TableCell component="th" scope="row" align="center"> 1 lozenge every 2 hours</TableCell>
                            <TableCell component="th" scope="row" align="center"> Every 4-6 hours</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" align="center"> Nasal congestion</TableCell>
                            <TableCell component="th" scope="row" align="center"> Saline nasal spray</TableCell>
                            <TableCell component="th" scope="row" align="center"> 1-2 sprays per nostril every few hours</TableCell>
                            <TableCell component="th" scope="row" align="center"> Every 4-6 hours</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
