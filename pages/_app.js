// pages/_app.js
import React from 'react';
import Header from '../components/Header';
// import '../app/globals.css'; // You can create this file for global styles if needed
import AdminLayout from'../components/AdminLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../utility/styles/globals.css';
// import 'bootstrap';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      {/* <Header /> */}
      <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
    </div>
  );
}

// Run JavaScript only on the client side
if (typeof window !== 'undefined') {
  require('bootstrap/dist/js/bootstrap.bundle.min.js');
}


export default MyApp;
