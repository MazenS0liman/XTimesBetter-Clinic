import React from 'react';

// Styles
import styles from './viewAdminMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages

// Components
import { Navbar } from '../../../components/navBar/navBar';

export const ViewAdminMainPage = () => {
    const list = [];

    return (
        <div className={styles['main-div']}>
            <Navbar name="Admin" list={list} />
            <>
            <Routes>
            </Routes>
            </>
        </div>
    )
}