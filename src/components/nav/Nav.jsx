import React from 'react';
import logo from '../../assets/stocker_name.svg';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    InboxIcon,
} from "@heroicons/react/24/solid";
import { MdOutlineInventory } from "react-icons/md";
import { Link } from "react-router-dom";

const Nav = () => {
    // Get userInfo from localStorage and parse it
    const userInfoFromStorage = localStorage.getItem('userInfo');
    const userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage).user : null;

    // Check for the user roles
    const isSuperAdmin = userInfo && userInfo.role === 'superadmin';
    const isAdmin = userInfo && userInfo.role === 'admin';

    return (
        <Card className="flex items-center w-3/12 h-full fixed top-0 rounded-none text-white"
              style={{ background: "#212D3B" }}>
            <div className="mb-2 py-10">
                <img
                    src={logo}
                    alt="logo"
                    className="w-40"
                />
            </div>
            <List>
                <ListItem className="text-2xl py-5 text-white hover:bg-gray-800 transition-colors duration-200">
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-7 w-7 text-white"/>
                    </ListItemPrefix>
                    <Link to={"/"} className="text-white">Dashboard</Link>
                </ListItem>
                {/* Conditionally render User Management link based on the user's role */}
                {isSuperAdmin && (
                    <ListItem className="text-2xl py-5 text-white hover:bg-gray-800 transition-colors duration-200">
                        <ListItemPrefix>
                            <UserCircleIcon className="h-7 w-7 text-white"/>
                        </ListItemPrefix>
                        <Link to={"/user-management"} className="text-white">User Management</Link>
                    </ListItem>
                )}
                <ListItem className="text-2xl py-5 text-white hover:bg-gray-800 transition-colors duration-200">
                    <ListItemPrefix>
                        <InboxIcon className="h-7 w-7 text-white"/>
                    </ListItemPrefix>
                    <Link to={"/movement"} className="text-white">Movement</Link>
                </ListItem>
                <ListItem className="text-2xl py-5 text-white hover:bg-gray-800 transition-colors duration-200">
                    <ListItemPrefix>
                        <ShoppingBagIcon className="h-7 w-7 text-white"/>
                    </ListItemPrefix>
                    <Link to={"/products"} className="text-white">Products</Link>
                </ListItem>

                {/* Conditionally render Inventory link based on admin or superadmin roles */}
                {(isSuperAdmin || isAdmin) && (
                    <ListItem className="text-2xl py-5 text-white hover:bg-gray-800 transition-colors duration-200">
                        <ListItemPrefix>
                            <MdOutlineInventory className="h-7 w-7 text-white"/>
                        </ListItemPrefix>
                        <Link to={"/inventory"} className="text-white">Inventory</Link>
                    </ListItem>
                )}
            </List>
        </Card>
    );
};

export default Nav;