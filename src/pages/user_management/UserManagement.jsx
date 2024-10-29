import React, { useState } from 'react';
import { Card, Typography, Button, Dialog, DialogBody, DialogFooter, Input, Select, Option, IconButton } from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const UserManagement = () => {
    const [userData, setUserData] = useState([
        { id: 1, name: "Starlow", date: "2024.03.24", email: "starlow@example.com", password: "secret123", role: "admin" },
        { id: 2, name: "Starlow", date: "2024.03.24", email: "starlow@example.com", password: "hidden456", role: "user" },
        // Add more entries as needed
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', date: '', email: '', password: '', role: '' });
    const [showPassword, setShowPassword] = useState({});
    const [showEditPassword, setShowEditPassword] = useState(false);

    const handleDelete = (id) => {
        setUserData(userData.filter((user) => user.id !== id));
    };

    const handleEditClick = (user) => {
        setEditData(user);
        setIsAddMode(false);
        setShowEditPassword(false); // Reset visibility when opening the dialog
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setEditData({ id: Date.now(), name: '', date: '', email: '', password: '', role: '' });
        setIsAddMode(true);
        setShowEditPassword(false); // Reset visibility when opening the dialog
        setIsDialogOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = () => {
        if (isAddMode) {
            setUserData([...userData, editData]);
        } else {
            setUserData(userData.map((user) => (user.id === editData.id ? editData : user)));
        }
        setIsDialogOpen(false);
    };

    const toggleShowPassword = (id) => {
        setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleShowEditPassword = () => {
        setShowEditPassword(!showEditPassword);
    };

    return (
        <Card className="p-6 bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" color="gray-300">
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
                {userData.map((user) => (
                    <tr key={user.id} className={user.id % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.date}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 flex items-center">
                            {showPassword[user.id] ? user.password : "••••••••"}
                            <IconButton
                                variant="text"
                                color="gray-300"
                                onClick={() => toggleShowPassword(user.id)}
                                className="ml-2"
                            >
                                {showPassword[user.id] ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </IconButton>
                        </td>
                        <td className="p-3">{user.role}</td>
                        <td className="p-3 flex gap-2">
                            <Button size="sm" color="blue" onClick={() => handleEditClick(user)}>
                                Edit
                            </Button>
                            <Button size="sm" color="red" onClick={() => handleDelete(user.id)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(!isDialogOpen)}>
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <Input label="Name" name="name" value={editData.name} onChange={handleEditChange} />
                        <Input label="Date" name="date" value={editData.date} onChange={handleEditChange} />
                        <Input label="Email" name="email" value={editData.email} onChange={handleEditChange} />
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
                                color="gray-300"
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
        </Card>
    );
};

export default UserManagement;
