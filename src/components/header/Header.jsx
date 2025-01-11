import React, { useState, useEffect } from "react";
import { AvatarWithUserDropdown } from "../Avatar/Avatar.jsx";

const timeZones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Kolkata",
    "Australia/Sydney"
];

const Header = () => {
    const [dateTime, setDateTime] = useState("");
    const [selectedTimeZone, setSelectedTimeZone] = useState("UTC");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Intl.DateTimeFormat('en-US', {
                timeZone: selectedTimeZone,
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(new Date()));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [selectedTimeZone]);

    return (
        <header className="flex w-9/12 justify-between items-center p-4 right-0 fixed z-10" style={{ background: "#212D3B" }}>
            <div>
                <p style={{ color: "#8FBCDF" }}>{dateTime}</p>
                <select
                    value={selectedTimeZone}
                    onChange={(e) => setSelectedTimeZone(e.target.value)}
                    style={{
                        marginTop: "8px",
                        padding: "4px",
                        backgroundColor: "#212D3B",
                        color: "#8FBCDF",
                        border: "1px solid #8FBCDF",
                        borderRadius: "4px"
                    }}
                >
                    {timeZones.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <AvatarWithUserDropdown></AvatarWithUserDropdown>
            </div>
        </header>
    );
};

export default Header;