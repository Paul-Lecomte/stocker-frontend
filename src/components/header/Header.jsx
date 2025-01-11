import React, { useState, useEffect } from "react";
import { AvatarWithUserDropdown } from "../Avatar/Avatar.jsx";

const Header = () => {
    const [dateTime, setDateTime] = useState("");

    useEffect(() => {
        // Automatically detect the user's time zone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Update dateTime every second
        const intervalId = setInterval(() => {
            const now = new Date();
            const formattedTime = new Intl.DateTimeFormat("en-US", {
                timeZone: userTimeZone,
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(now);
            setDateTime(formattedTime);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <header
            className="flex w-9/12 justify-between items-center p-4 right-0 fixed z-10"
            style={{ background: "#212D3B" }}
        >
            <div>
                <p style={{ color: "#8FBCDF" }}>{dateTime}</p>
            </div>
            <div className="flex items-center space-x-2">
                <AvatarWithUserDropdown></AvatarWithUserDropdown>
            </div>
        </header>
    );
};

export default Header;