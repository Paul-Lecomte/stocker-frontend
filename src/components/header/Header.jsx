import React, { useState, useEffect } from "react";
import { AvatarWithUserDropdown } from "../Avatar/Avatar.jsx"; // Remplace par le bon chemin d'importation
import { format } from "date-fns";

const Header = () => {
    const [dateTime, setDateTime] = useState(format(new Date(), 'dd MMMM yyyy H:mm:ss'));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(format(new Date(), 'dd MMMM yyyy H:mm:ss'));
        }, 1000);

        // Nettoyage de l'intervalle lorsque le composant est démonté
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="flex w-9/12 justify-between items-center p-4 right-0 fixed z-10">
            <p style={{color: "#8FBCDF"}}>{dateTime}</p>
            <div className="flex items-center space-x-2">
                <AvatarWithUserDropdown></AvatarWithUserDropdown>
            </div>
        </header>
    );
};

export default Header;
