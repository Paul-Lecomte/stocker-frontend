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
    Spinner
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useFurnitureStore} from "../../stores/furnitureStore.js";

const Inventory = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [aisles, setAisles] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', quantity: '', price: '', description: '', location: '' });
    const [picture, setPicture] = useState(null);
    const [isAisleDialogOpen, setIsAisleDialogOpen] = useState(false);
    const [aisleLocation, setAisleLocation] = useState('');
    const navigate = useNavigate();
    const { furnitureLoading } = useFurnitureStore();

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

    // Fetch username from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const { first_name, last_name } = userInfo ? userInfo.user : {};
    const username = `${first_name} ${last_name}`.trim();

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

    // Handle picture file change
    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
    };

    // Save item (add or update) with picture upload
    const handleSave = async () => {
        try {
            if (isAddMode) {
                if (!editData.name || !editData.quantity || !editData.price || !editData.description || !editData.location) {
                    console.error("Missing required fields for creation");
                    return;
                }
            }

            const formData = new FormData();
            formData.append("name", editData.name);
            formData.append("quantity", editData.quantity);
            formData.append("price", editData.price);
            formData.append("description", editData.description);
            formData.append("location", editData.location);
            formData.append("modifiedBy", username);
            if (picture) formData.append("picture", picture);

            const url = isAddMode ?
                'http://localhost:3000/api/furniture/create' :
                `http://localhost:3000/api/furniture/update/${editData._id}`;
            const method = isAddMode ? 'post' : 'put';

            const { data } = await axios({
                url,
                method,
                data: formData,
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setInventoryData(isAddMode ? [...inventoryData, data] : inventoryData.map(item => item._id === data._id ? data : item));
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving item:", error.response ? error.response.data : error);
        }
    };

    // Handle product details view
    const handleDetailsClick = (id) => {
        navigate(`/products_details/${id}`);
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
                {inventoryData.map((item, index) => (
                    <tr key={item._id} className={index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
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

                        <Typography variant="h6" className="mt-4">Existing Aisles:</Typography>
                        <ul>
                            {aisles.map((aisle) => (
                                <li key={aisle._id} className="flex justify-between">
                                    {aisle.location}
                                    <Button color="red" size="sm" onClick={() => handleDeleteAisle(aisle._id)}>
                                        Delete
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={() => setIsAisleDialogOpen(false)} color="red">Cancel</Button>
                </DialogFooter>
            </Dialog>

            {/* Edit/Add Item Dialog */}
            <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(!isDialogOpen)}>
                <DialogBody>
                    <Typography variant="h6">{isAddMode ? "Add New Item" : "Edit Item"}</Typography>
                    <div className="flex flex-col gap-4 mt-4">
                        <Input
                            label="Name"
                            name="name"
                            value={editData.name}
                            onChange={handleEditChange}
                        />
                        <Input
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={editData.quantity}
                            onChange={handleEditChange}
                        />
                        <Input
                            label="Price"
                            name="price"
                            type="number"
                            value={editData.price}
                            onChange={handleEditChange}
                        />
                        <Input
                            label="Description"
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                        />
                        <Select label="Location" value={editData.location} onChange={handleLocationChange}>
                            {aisles.map((aisle) => (
                                <Option key={aisle._id} value={aisle.location}>
                                    {aisle.location}
                                </Option>
                            ))}
                        </Select>
                        <input type="file" onChange={handlePictureChange} />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button onClick={() => setIsDialogOpen(false)} color="red">Cancel</Button>
                    <Button onClick={handleSave} color="green">
                        Save
                    </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default Inventory;