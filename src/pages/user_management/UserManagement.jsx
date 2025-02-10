import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    IconButton,
    Spinner
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import {useFurnitureStore} from "../../stores/furnitureStore.js";

const UserManagement = () => {
    const [userData, setUserData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editData, setEditData] = useState({ first_name: '', last_name: '', createdAt: '', email: '', role: '' });
    const [showPassword, setShowPassword] = useState({});
    const [showEditPassword, setShowEditPassword] = useState(false);
    const { furnitureLoading } = useFurnitureStore();

    // For delete confirmation dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/', {
                    method: 'get',
                    withCredentials: true
                });
                setUserData(response.data);  // Update state with fetched user data
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);  // Empty dependency array ensures it runs only once on component mount

    const handleDeleteClick = (id) => {
        setDeleteUserId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/user/delete/${deleteUserId}`, {
                method: 'delete',
                withCredentials: true
            });

            // Update local state to remove the deleted user
            setUserData(userData.filter(user => user._id !== deleteUserId));

            // Close the delete confirmation dialog
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleEditClick = (user) => {
        setEditData(user);
        setIsAddMode(false);
        setShowEditPassword(false); // Reset the password visibility state
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setEditData({ id: Date.now(), first_name: '', last_name: '', createdAt: '', email: '', password: '', role: '' });
        setIsAddMode(true);
        setShowEditPassword(false); // Reset the password visibility state
        setIsDialogOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = async () => {
        if (isAddMode) {
            try {
                // Make the API call to add the user
                const response = await axios.post('http://localhost:3000/api/user/register', {
                    first_name: editData.first_name,
                    last_name: editData.last_name,
                    email: editData.email,
                    password: editData.password,
                    role: editData.role,
                }, {
                    method: 'post',
                    withCredentials: true,
                });

                // Update local state to add the new user
                setUserData([...userData, response.data]);

                // Close the dialog
                setIsDialogOpen(false);
            } catch (error) {
                console.error('Error adding user:', error);
            }
        } else {
            try {
                const updatedUser = {
                    first_name: editData.first_name,
                    last_name: editData.last_name,
                    email: editData.email,
                    role: editData.role,
                };

                // Only send the password if it's updated
                if (editData.password) {
                    updatedUser.password = editData.password;
                }

                // Update the user in the backend
                const response = await axios.put(
                    'http://localhost:3000/api/user/update',
                    updatedUser,
                    { withCredentials: true }
                );

                // Update the local state after successful update
                setUserData(userData.map((user) =>
                    user._id === response.data._id ? response.data : user
                ));

                // Close the dialog
                setIsDialogOpen(false);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    const toggleShowPassword = (id) => {
        setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleShowEditPassword = () => {
        setShowEditPassword(!showEditPassword);
    };

    if (furnitureLoading)
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner className="h-12 w-12"/>
            </div>
        );

    return (
        <Card className="rounded-none p-6 bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">
                    User Management
                </Typography>
                <Button size="sm" color="green" onClick={handleAddClick}>
                    Add User
                </Button>
            </div>
            <table className="min-w-full text-left text-sm">
                <thead>
                <tr className="bg-gray-700">
                    <th className="p-3">Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Password</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {userData.map((user, index) => (
                    <tr key={user._id} className={index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                        <td className="p-3">{user.first_name} {user.last_name}</td>
                        <td className="p-3">{user.createdAt.substring(0, 10)}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 flex items-center">
                            {"••••••••"}
                            <IconButton
                                variant="text"
                                onClick={() => toggleShowPassword(user._id)}
                                className="ml-2"
                            >
                                {showPassword[user._id] ? <EyeSlashIcon className="w-5 h-5"/> :
                                    <EyeIcon className="w-5 h-5"/>}
                            </IconButton>
                        </td>
                        <td className="p-3">{user.role}</td>
                        <td className="p-3 flex gap-2">
                            <Button size="sm" color="blue" onClick={() => handleEditClick(user)}>
                                Edit
                            </Button>
                            <Button size="sm" color="red" onClick={() => handleDeleteClick(user._id)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Edit/Add User Dialog */}
            <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(!isDialogOpen)}>
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Last Name"
                            name="last_name"
                            value={editData.last_name}
                            onChange={handleEditChange}
                        />
                        <Input
                            label="First Name"
                            name="first_name"
                            value={editData.first_name}
                            onChange={handleEditChange}
                        />
                        <Input
                            label="Email"
                            name="email"
                            value={editData.email}
                            onChange={handleEditChange}
                        />
                        {/* Option to update password */}
                        <div className="flex items-center">
                            <Input
                                label="Password"
                                name="password"
                                type={showEditPassword ? "text" : "password"}
                                value={editData.password}
                                onChange={handleEditChange}
                            />
                            <IconButton
                                variant="text"
                                onClick={toggleShowEditPassword}
                                className="ml-2"
                            >
                                {showEditPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </IconButton>
                        </div>
                        <Select label="Role" name="role" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e })}>
                            <Option value="admin">Admin</Option>
                            <Option value="user">User</Option>
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="blue" onClick={handleSave}>
                        {isAddMode ? "Add" : "Save"}
                    </Button>
                    <Button color="gray" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} handler={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}>
                <DialogBody>
                    <Typography variant="h6">Are you sure you want to delete this user?</Typography>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={handleDeleteConfirm}>Delete</Button>
                    <Button color="gray" onClick={handleDeleteCancel}>Cancel</Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default UserManagement;