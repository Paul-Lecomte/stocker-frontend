import React from 'react';
import { Typography } from "@material-tailwind/react";

const Footer = () => {
    return (
        <footer className="w-full py-4 text-gray-400 z-50"
                style={{ marginLeft: "25%", width: "75%", position: "relative", background: "#101923" }}>
            <Typography variant="small" className="text-center text-gray-400">
                © {new Date().getFullYear()} Stocker. All rights reserved.
            </Typography>
        </footer>
    );
};

export default Footer;