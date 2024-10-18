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
            <Outlet />
            <Footer />
        </div>
    );
};

export default Layout;