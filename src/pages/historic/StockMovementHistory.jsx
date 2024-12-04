import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Dialog, DialogBody, DialogFooter, Input, Select, Option } from "@material-tailwind/react";
import axios from 'axios';

const StockMovementHistory = () => {
    const [movements, setMovements] = useState([]);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', userId: '' });
    const [users, setUsers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Fetch available users for filter
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/', {
                    method: 'get',
                    withCredentials: true
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const fetchMovements = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/stock-movements/history', {
                params: filters,
                withCredentials: true
            });
            setMovements(response.data);
        } catch (error) {
            console.error('Error fetching stock movements:', error);
        }
    };

    useEffect(() => {
        fetchMovements();
    }, [filters]); // Fetch movements whenever filters change

    const handleFilterChange = (value, name) => {
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    return (
        <Card className="rounded-none p-6 bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">Stock Movement History</Typography>
                <Button size="sm" color="green" onClick={() => setIsDialogOpen(true)}>
                    Filter
                </Button>
            </div>

            <table className="min-w-full text-left text-sm">
                <thead>
                <tr className="bg-gray-600">
                    <th className="p-3">Furniture Name</th>
                    <th className="p-3">Movement Type</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">User</th>
                </tr>
                </thead>
                <tbody>
                {movements.map((movement, index) => (
                    <tr key={movement._id} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                        <td className="p-3">{movement.name}</td>
                        <td className="p-3">{movement.movementType}</td>
                        <td className="p-3">{movement.quantityChange}</td>
                        <td className="p-3">{new Date(movement.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">{movement.modifiedBy || 'Unknown'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Filter Dialog */}
            <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(!isDialogOpen)}>
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange(e.target.value, 'startDate')}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange(e.target.value, 'endDate')}
                        />
                        <Select label="User" name="userId" value={filters.userId} onChange={(value) => handleFilterChange(value, 'userId')}>
                            <Option value="">All Users</Option>
                            {users.map((user) => (
                                <Option key={user._id} value={`${user.first_name} ${user.last_name}`}>
                                    {user.first_name} {user.last_name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="blue" onClick={() => { fetchMovements(); setIsDialogOpen(false); }}>
                        Apply Filters
                    </Button>
                    <Button color="gray" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default StockMovementHistory;