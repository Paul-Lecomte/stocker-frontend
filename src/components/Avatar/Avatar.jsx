import React from "react";
import { useAuthStore } from "../../stores/authStore.js";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Button,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Typography,
} from "@material-tailwind/react";
import { PowerIcon } from "@heroicons/react/24/solid";
import {useUserStore} from "../../stores/userStore.js";

const profileMenuItems = [
    {
        label: "Sign Out",
        icon: PowerIcon,
    },
];

export function AvatarWithUserDropdown() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { logout} = useAuthStore();
    const { userLogout} = useUserStore();
    const navigate = useNavigate();

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = async () => {
        try {
            await userLogout();
            logout();
            navigate('login');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center rounded-full p-0"
                >
                    <Avatar
                        variant="circular"
                        size="md"
                        alt="User Profile"
                        withBorder={true}
                        color="blue-gray"
                        className="p-0.5"
                        src="/user_default.png"
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                {profileMenuItems.map(({ label, icon }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                        <MenuItem
                            key={label}
                            onClick={isLastItem ? handleLogout : closeMenu}
                            className={`flex items-center gap-2 rounded ${
                                isLastItem
                                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                                    : ""
                            }`}
                        >
                            {React.createElement(icon, {
                                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal"
                                color={isLastItem ? "red" : "inherit"}
                            >
                                {label}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}
