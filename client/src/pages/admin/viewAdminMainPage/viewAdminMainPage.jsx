import React from 'react';

// Styles
import styles from './viewAdminMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import  AddPackage  from '../AddPackage/AddPackage';
import  UpdatePackage  from '../UpdatePackage/UpdatePackage';
import  DeletePackage  from '../DeletePackage/DeletePackage';

// Components
import { Navbar } from '../../../components/navBar/navBar';

export const ViewAdminMainPage = () => {
    const list = [
        {
            url: "/admin/AddPackage",
            pageName: "Add Package",
        },
        {
            url: "/admin/UpdatePackage",
            pageName: "Update Package",
        },
        {
            url: "/admin/DeletePackage",
            pageName: "Delete Package",
        }
    ];

    return (
        <div className={styles['main-div']}>
            <Navbar name="Admin" list={list} />
            <>
            <Routes>
            <Route path='/AddPackage' element={<AddPackage />} />
            <Route path='/UpdatePackage' element={<UpdatePackage />}/> 
            <Route path='/DeletePackage' element={<DeletePackage />} /> 
            </Routes>
            </>
        </div>
    )
}