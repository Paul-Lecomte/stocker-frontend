import React from 'react';
import logo from '../../assets/stocker_name.svg';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    InboxIcon,
} from "@heroicons/react/24/solid";
import { MdOutlineInventory } from "react-icons/md";
import './nav.css'
import colors from "tailwindcss/colors.js";

const Nav = () => {
    return (
        <Card className="flex items-center w-3/12 h-full fixed top-0 rounded-none"
              style={{background: "#212D3B", color: "#4F5C6B"}}>
            <div className="mb-2 py-10">
                <img
                    src={logo}
                    alt="logo"
                    className="w-40"
                />
            </div>
            <List>
                <ListItem className="text-2xl py-5">
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-7 w-7"/>
                    </ListItemPrefix>
                    <a href="/">Dashboard</a>
                </ListItem>
                <ListItem className="text-2xl py-5">
                    <ListItemPrefix>
                        <UserCircleIcon className="h-7 w-7"/>
                    </ListItemPrefix>
                    <a href="/user-management">User Management</a>
                </ListItem>
                <ListItem className="text-2xl py-5">
                    <ListItemPrefix>
                        <InboxIcon className="h-7 w-7"/>
                    </ListItemPrefix>
                    <a href="/movement">Movement</a>
                </ListItem>
                <ListItem className="text-2xl py-5">
                    <ListItemPrefix>
                        <ShoppingBagIcon className="h-7 w-7"/>
                    </ListItemPrefix>
                    <a href="/products">Products</a>
                </ListItem>

                <ListItem className="text-2xl py-5">
                    <ListItemPrefix>
                        <MdOutlineInventory className="h-7 w-7"/>
                    </ListItemPrefix>
                    <a href="/inventory">Inventory</a>
                </ListItem>
            </List>
        </Card>
    );
};

export default Nav;