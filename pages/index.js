// pages/datagrid.js
import React, { useState,useEffect } from 'react';
import Router from 'next/router';

const HomePage = () => {
    useEffect(() => {
        Router.push('/dashboard', `/dashboard`);
      }, []);

    return (
        <div>

        </div>
    );
};

export default HomePage;
