import React from 'react';
import logo from '../../assets/stocker_name.svg';
import {
    Card,
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
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
    // Get userInfo from localStorage and parse it
    const userInfoFromStorage = localStorage.getItem('userInfo');
    const userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage).user : null;

    // Check for the user roles
    const isSuperAdmin = userInfo && userInfo.role === 'superadmin';
    const isAdmin = userInfo && userInfo.role === 'admin';

    // Get the current URL
    const location = useLocation();

    return (
        <Card className="flex items-center w-3/12 h-full fixed top-0 rounded-none text-white"
              style={{ background: "#212D3B" }}>
            <div className="py-11">
                <img
                    src={logo}
                    alt="logo"
                    className="w-40"
                />
            </div>
            <List className="h-2/3 flex flex-col justify-around">
                <ListItem
                    className={`text-2xl hover:bg-gray-200 transition-colors duration-200 ${location.pathname === "/" ? "text-blue-500" : "text-white"}`}
                >
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-7 w-7"/>
                    </ListItemPrefix>
                    <Link to={"/"}>Dashboard</Link>
                </ListItem>
                <ListItem
                    className={`text-2xl hover:bg-gray-200 transition-colors duration-200 ${location.pathname === "/movement" ? "text-blue-500" : "text-white"}`}
                >
                    <ListItemPrefix>
                        <InboxIcon className="h-7 w-7"/>
                    </ListItemPrefix>
                    <Link to={"/movement"}>Movement</Link>
                </ListItem>
                <ListItem
                    className={`text-2xl hover:bg-gray-200 transition-colors duration-200 ${location.pathname === "/products" ? "text-blue-500" : "text-white"}`}
                >
                    <ListItemPrefix>
                        <ShoppingBagIcon className="h-7 w-7"/>
                    </ListItemPrefix>
                    <Link to={"/products"}>Products</Link>
                </ListItem>

                {/* Conditionally render Inventory link based on admin or superadmin roles */}
                {(isSuperAdmin || isAdmin) && (
                    <>
                        <ListItem
                            className={`text-2xl hover:bg-gray-200 transition-colors duration-200 ${location.pathname === "/inventory" ? "text-blue-500" : "text-white"}`}
                        >
                            <ListItemPrefix>
                                <MdOutlineInventory className="h-7 w-7"/>
                            </ListItemPrefix>
                            <Link to={"/inventory"}>Inventory</Link>
                        </ListItem>

                        {/* New Stock Movement History link for admin only */}
                        <ListItem
                            className={`text-2xl hover:bg-gray-200 transition-colors duration-200 ${location.pathname === "/stock_movement_history" ? "text-blue-500" : "text-white"}`}
                        >
                            <ListItemPrefix>
                                <ShoppingBagIcon className="h-7 w-7"/>
                            </ListItemPrefix>
                            <Link to={"/stock_movement_history"}>Stock Movement History</Link>
                        </ListItem>
                    </>
                )}
                {/* Conditionally render User Management link based on the user's role */}
                {isSuperAdmin && (
                    <ListItem
                        className={`text-2xl hover:bg-gray-200 transition-colors duration-200 ${location.pathname === "/user-management" ? "text-blue-500" : "text-white"}`}
                    >
                        <ListItemPrefix>
                            <UserCircleIcon className="h-7 w-7"/>
                        </ListItemPrefix>
                        <Link to={"/user-management"}>User Management</Link>
                    </ListItem>
                )}
            </List>
        </Card>
    );
};

export default Nav;