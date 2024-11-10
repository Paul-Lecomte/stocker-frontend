import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../header/Header.jsx";
import Footer from "../footer/Footer.jsx";
import Nav from "../nav/Nav.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if userInfo exists in localStorage (indicating that the user is logged in)
        const userInfoFromStorage = localStorage.getItem('userInfo');

        // If userInfo doesn't exist, redirect to login page
        if (!userInfoFromStorage) {
            navigate('/login');  // Redirect to login if not logged in
        }
    }, [navigate]);  // Only rerun this effect when navigate changes

    return (
        <div className="App">
            <Header />
            <Nav />
            <div className="right-0 w-9/12 h-screen py-20"
                 style={{ background: "#101923", marginLeft: "25%" }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
