import React from 'react';
import Header from "../header/Header.jsx";
import Footer from "../footer/Footer.jsx";
import Nav from "../nav/Nav.jsx";
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <div className="App">
            <Header />
            <Nav />
            <div className="right-0 w-9/12 h-screen py-20 "
            style={{background: "#101923", marginLeft: "25%"}}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;