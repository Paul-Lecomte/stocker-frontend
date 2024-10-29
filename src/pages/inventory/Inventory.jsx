import React, { useState } from 'react';
import { Card, Typography, Button, Dialog, DialogBody, DialogFooter, Input } from "@material-tailwind/react";

const Inventory = () => {
    const [inventoryData, setInventoryData] = useState([
        { id: 1, name: "Starlow", creation: "2024.03.24", nbr: 25, location: "aisle 2B" },
        { id: 2, name: "Starlow", creation: "2024.03.24", nbr: 267, location: "aisle 2B" },
        { id: 3, name: "Starlow", creation: "2024.03.24", nbr: 37, location: "aisle 2B" },
        { id: 4, name: "Starlow", creation: "2024.03.24", nbr: 25, location: "aisle 2B" },
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', creation: '', nbr: '', location: '' });

    const handleDelete = (id) => {
        setInventoryData(inventoryData.filter((item) => item.id !== id));
    };

    const handleEditClick = (item) => {
        setEditData(item);
        setIsAddMode(false);
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setEditData({ id: Date.now(), name: '', creation: '', nbr: '', location: '' });
        setIsAddMode(true);
        setIsDialogOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSave = () => {
        if (isAddMode) {
            setInventoryData([...inventoryData, editData]);
        } else {
            setInventoryData(inventoryData.map((item) => (item.id === editData.id ? editData : item)));
        }
        setIsDialogOpen(false);
    };

    return (
        <Card className="p-6 bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" color="gray-300">
                    Inventory
                </Typography>
                <Button size="sm" color="green" onClick={handleAddClick}>
                    Add Entry
                </Button>
            </div>
            <table className="min-w-full text-left text-sm">
                <thead>
                <tr className="bg-gray-700">
                    <th className="p-3">Name</th>
                    <th className="p-3">Creation</th>
                    <th className="p-3">Nbr</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {inventoryData.map((item) => (
                    <tr key={item.id} className={item.id % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.creation}</td>
                        <td className="p-3">{item.nbr}</td>
                        <td className="p-3">{item.location}</td>
                        <td className="p-3 flex gap-2">
                            <Button size="sm" color="blue" onClick={() => handleEditClick(item)}>
                                Edit
                            </Button>
                            <Button size="sm" color="red" onClick={() => handleDelete(item.id)}>
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
                        <Input label="Creation" name="creation" value={editData.creation} onChange={handleEditChange} />
                        <Input label="Nbr" name="nbr" type="number" value={editData.nbr} onChange={handleEditChange} />
                        <Input label="Location" name="location" value={editData.location} onChange={handleEditChange} />
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
