import React, { useState } from 'react';
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import Footer from '../Component/Footer/Footer';

function NotFound() {

    return (
        <React.Fragment>
            <div className="page-wrapper" style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <HeaderComponents />
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0,
                }}>
                    <h1 style={{ fontSize: '5rem', color: '#d32f2f', marginBottom: '1rem' }}>404</h1>
                    <h2 style={{ color: '#333', marginBottom: '1rem' }}>Page Not Found</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Sorry, the page you are looking for does not exist.</p>
                    <a href="/" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 'bold' }}>Go to Home</a>
                </div>
                <div style={{ flexShrink: 0 }}>
                    <Footer />
                </div>
            </div>
        </React.Fragment>
    );
}

export default NotFound;
