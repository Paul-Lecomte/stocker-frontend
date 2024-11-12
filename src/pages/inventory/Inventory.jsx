import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Dialog, DialogBody, DialogFooter, Input, Select, Option } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [aisles, setAisles] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', quantity: '', price: '', description: '', location: '' });
    const [isAisleDialogOpen, setIsAisleDialogOpen] = useState(false);
    const [aisleLocation, setAisleLocation] = useState('');
    const navigate = useNavigate();

    // Fetch inventory and aisle data from backend on component mount
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/furniture/inventory', {
                    method: 'get',
                    withCredentials: true
                });
                setInventoryData(data);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            }
        };

        const fetchAisles = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/aisles/all', {
                    method: 'get',
                    withCredentials: true
                });
                setAisles(data);
            } catch (error) {
                console.error("Error fetching aisles:", error);
            }
        };

        fetchInventory();
        fetchAisles();
    }, []);

    // Handle aisle addition
    const handleAddAisle = async () => {
        try {
            const { data } = await axios.post('http://localhost:3000/api/aisles/', { location: aisleLocation }, {
                method: 'post',
                withCredentials: true
            });
            setAisles([...aisles, data]);
            setAisleLocation(''); // Clear input
        } catch (error) {
            console.error("Error adding aisle:", error);
        }
    };

    // Handle aisle deletion
    const handleDeleteAisle = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/aisles/${id}`, {
                method: 'delete',
                withCredentials: true
            });
            setAisles(aisles.filter((aisle) => aisle._id !== id));
        } catch (error) {
            console.error("Error deleting aisle:", error);
        }
    };

    // Handle item delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/furniture/delete/${id}`, {
                method: 'delete',
                withCredentials: true
            });
            setInventoryData(inventoryData.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    // Handle edit click
    const handleEditClick = (item) => {
        setEditData({
            _id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            description: item.description,
            location: item.location,
        });
        setIsAddMode(false);
        setIsDialogOpen(true);
    };

    // Handle add click
    const handleAddClick = () => {
        setEditData({ name: '', quantity: '', price: '', description: '', location: '' });
        setIsAddMode(true);
        setIsDialogOpen(true);
    };

    // Handle change in fields
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    // Handle location change
    const handleLocationChange = (value) => {
        setEditData({ ...editData, location: value });
    };

    // Save item (add or update)
    const handleSave = async () => {
        try {
            // Validate fields based on the mode (Add or Edit)
            if (isAddMode) {
                // Validation for add mode (all fields are required)
                if (!editData.name || !editData.quantity || !editData.price || !editData.description || !editData.location) {
                    console.error("Missing required fields for creation");
                    return; // Prevent sending the request if fields are missing
                }
            }

            if (isAddMode) {
                // Add item if in "add" mode
                const { data } = await axios.post('http://localhost:3000/api/furniture/create', editData, {
                    method: 'post',
                    withCredentials: true
                });
                setInventoryData([...inventoryData, data]);
            } else {
                // Update item if in "edit" mode (fields are optional)
                const { data } = await axios.put(`http://localhost:3000/api/furniture/update/${editData._id}`, editData, {
                    method: 'put',
                    withCredentials: true
                });
                setInventoryData(inventoryData.map((item) => (item._id === data._id ? data : item)));
            }

            setIsDialogOpen(false); // Close dialog after saving
        } catch (error) {
            console.error("Error saving item:", error.response ? error.response.data : error);
        }
    };

    // Handle product details view
    const handleDetailsClick = (id) => {
        navigate(`/products_details/${id}`);
    };

    return (
        <Card className="p-6 bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" color="white">
                    Inventory
                </Typography>
                <div className="flex gap-2">
                    <Button size="sm" color="green" onClick={handleAddClick}>
                        Add Entry
                    </Button>
                    <Button size="sm" color="orange" onClick={() => setIsAisleDialogOpen(true)}>
                        Add/Delete Aisle
                    </Button>
                </div>
            </div>

            {/* Inventory Table */}
            <table className="min-w-full text-left text-sm">
                <thead>
                <tr className="bg-gray-700">
                    <th className="p-3">Name</th>
                    <th className="p-3">Nbr</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {inventoryData.map((item) => (
                    <tr key={item._id} className={item._id % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{item.location}</td>
                        <td className="p-3 flex gap-2">
                            <Button size="sm" color="blue" onClick={() => handleEditClick(item)}>
                                Edit
                            </Button>
                            <Button size="sm" color="red" onClick={() => handleDelete(item._id)}>
                                Delete
                            </Button>
                            <Button size="sm" color="purple" onClick={() => handleDetailsClick(item._id)}>
                                Details
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Aisle Management Dialog */}
            <Dialog open={isAisleDialogOpen} handler={() => setIsAisleDialogOpen(!isAisleDialogOpen)}>
                <DialogBody>
                    <Typography variant="h6">Manage Aisles</Typography>
                    <div className="flex flex-col gap-4 mt-4">
                        <Input
                            label="New Aisle Location"
                            value={aisleLocation}
                            onChange={(e) => setAisleLocation(e.target.value)}
                        />
                        <Button color="green" onClick={handleAddAisle}>Add Aisle</Button>

                        <Typography variant="h6" className="mt-6">Existing Aisles</Typography>
                        <ul className="list-disc ml-4">
                            {aisles.map((aisle) => (
                                <li key={aisle._id} className="flex justify-between items-center">
                                    <span>{aisle.location}</span>
                                    <Button
                                        size="sm"
                                        color="red"
                                        onClick={() => handleDeleteAisle(aisle._id)}>
                                        Delete
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="gray" onClick={() => setIsAisleDialogOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Inventory Item Edit/Add Dialog */}
            <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(!isDialogOpen)}>
                <DialogBody>
                    <Typography variant="h6">{isAddMode ? "Add" : "Edit"} Item</Typography>
                    <div className="flex flex-col gap-4 mt-4">
                        <Input label="Name" name="name" value={editData.name} onChange={handleEditChange} />
                        <Input label="Quantity" name="quantity" type="number" value={editData.quantity} onChange={handleEditChange} />
                        <Input label="Price" name="price" value={editData.price} onChange={handleEditChange} />
                        <Input label="Description" name="description" value={editData.description} onChange={handleEditChange} />

                        {/* Location select dropdown */}
                        <Select label="Location" name="location" value={editData.location} onChange={handleLocationChange}>
                            {aisles.map((aisle) => (
                                <Option key={aisle._id} value={aisle.location}>{aisle.location}</Option>
                            ))}
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

export default Inventory;