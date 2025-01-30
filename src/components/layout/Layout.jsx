import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../header/Header.jsx";
import Footer from "../footer/Footer.jsx";
import Nav from "../nav/Nav.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userInfoFromStorage = localStorage.getItem('userInfo');
        if (!userInfoFromStorage || userInfoFromStorage === '') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <Nav />
                <main
                    className="w-9/12 pt-20"
                    style={{ background: "#101923", marginLeft: "25%" }}
                >
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;