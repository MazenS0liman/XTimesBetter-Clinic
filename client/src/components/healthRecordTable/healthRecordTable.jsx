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
                            <TableCell>Medicine</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
