// Breadcrumb.js
import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';



const Breadcrumb = ({ breadcrumbs }) => {
    return (
        <div className="ml-auto d-flex align-items-center">
            <Breadcrumbs aria-label="breadcrumb" className=" breadcrumbs_">

                {breadcrumbs.map((crumb, index) => (
                    <div key={index}><Link activeclassname='is-active' to={crumb.href}>{crumb.icon} {crumb.label}</Link></div>
                ))}
            </Breadcrumbs>
        </div>
    );
};

export default Breadcrumb;
