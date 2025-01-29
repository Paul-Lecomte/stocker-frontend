import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from '@material-tailwind/react';

const NotificationsComp = () => {
    const [notifications, setNotifications] = useState([]);
    const [editNotification, setEditNotification] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newNotification, setNewNotification] = useState({
        name: '',
        furnitureId: '',
        threshold: '',
        comparison: 'LESS_THAN',
        email: '',
    });
    const [activeTab, setActiveTab] = useState('created');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFurniture, setFilteredFurniture] = useState([]);
    const [furnitureName, setFurnitureName] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const userId = userInfo?.user?._id;

                if (!userId) {
                    console.error("User not found in localStorage");
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/notifications/user/${userId}`, {
                    withCredentials: true,
                });

                setNotifications(response.data.length > 0 ? response.data : []);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setNotifications([]);
            }
        };

        fetchNotifications();
    }, []);

    const handleInputChange = (value, name) => {
        setNewNotification((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterFurniture(query);
    };

    const filterFurniture = async (query) => {
        if (query) {
            try {
                const response = await axios.get('http://localhost:3000/api/furniture/search', {
                    params: { name: query },
                    withCredentials: true,
                });
                setFilteredFurniture(response.data);
            } catch (error) {
                console.error('Failed to search furniture:', error);
            }
        } else {
            setFilteredFurniture([]);
        }
    };

    const handleFurnitureSelect = (furniture) => {
        setNewNotification((prev) => ({
            ...prev,
            furnitureId: furniture._id,
        }));
        setFurnitureName(furniture.name);
        setSearchQuery('');
        setFilteredFurniture([]);
    };

    const handleCreateNotification = async () => {
        const notificationData = {
            ...newNotification,
            threshold: Number(newNotification.threshold),
        };

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const userId = userInfo?.user?._id;

            if (!userId) {
                console.error("User ID not found in localStorage.");
                return;
            }

            const response = await axios.post('http://localhost:3000/api/notifications', {
                ...notificationData,
                userId: userId,
            }, {
                withCredentials: true,
            });

            setNotifications((prev) => [...prev, response.data.notification]);
            setNewNotification({
                name: '',
                furnitureId: '',
                threshold: '',
                comparison: 'LESS_THAN',
                email: '',
            });
        } catch (error) {
            console.error('Failed to create notification:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/notifications/${id}`, {
                withCredentials: true,
            });
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const filteredNotifications = (notifications || []).filter((notification) => {
        return activeTab === 'created'
            ? !notification.isActivated
            : notification.isActivated || notification.isTriggered;
    });

    const handleEditClick = (notification) => {
        setEditNotification({ ...notification });
        setModalOpen(true);
    };

    const handleEditChange = (value, name) => {
        setEditNotification((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSave = async () => {
        try {
            await axios.put(`http://localhost:3000/api/notifications/${editNotification._id}`, editNotification, {
                withCredentials: true,
            });
            setNotifications((prev) =>
                prev.map((n) => (n._id === editNotification._id ? editNotification : n))
            );
            setModalOpen(false);
        } catch (error) {
            console.error('Failed to update notification:', error);
        }
    };

    return (
        <Card className="p-8 bg-gray-800 text-white rounded-none">
            <Typography variant="h4" className="mb-6 text-center">Notifications</Typography>

            <div className="flex mb-8 justify-center space-x-6">
                <Button
                    onClick={() => setActiveTab('created')}
                    className={`px-6 py-3 text-lg ${activeTab === 'created' ? 'bg-blue-500' : 'bg-gray-700'}`}
                >
                    Created Notifications
                </Button>
                <Button
                    onClick={() => setActiveTab('activated')}
                    className={`px-6 py-3 text-lg ${activeTab === 'activated' ? 'bg-blue-500' : 'bg-gray-700'}`}
                >
                    Activated Notifications
                </Button>
            </div>

            <Card className="p-6 bg-gray-700 mb-8">
                <Typography variant="h5" className="mb-6 text-white">Create Notification</Typography>
                <form className="flex flex-col justify-around space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="relative mb-6">
                        <Input
                            label="Search Furniture"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            color="blue-gray"
                            className="text-white bg-gray-800 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {searchQuery && filteredFurniture.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white text-black shadow-lg rounded-md max-h-40 overflow-y-auto">
                                {filteredFurniture.map((furniture) => (
                                    <div
                                        key={furniture._id}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleFurnitureSelect(furniture)}
                                    >
                                        {furniture.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <Typography variant="lead" className="text-white">
                            Selected Furniture: {furnitureName || 'None'}
                        </Typography>
                    </div>

                    <Input
                        type="text"
                        label="Notification Name"
                        name="name"
                        value={newNotification.name}
                        onChange={e => handleInputChange(e.target.value, 'name')}
                        required
                        color="blue-gray"
                        className="text-white bg-gray-800 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <Input
                        type="text"
                        label="Threshold"
                        name="threshold"
                        value={newNotification.threshold}
                        onChange={e => handleInputChange(e.target.value, 'threshold')}
                        required
                        color="blue-gray"
                        className="text-white bg-gray-800 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                    />

                    <Input
                        type="email"
                        label="Notification Email (Optional)"
                        name="email"
                        value={newNotification.email}
                        onChange={(e) => handleInputChange(e.target.value, 'email')}
                        color="blue-gray"
                        className="text-white bg-gray-800 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <Select
                        label="Comparison"
                        name="comparison"
                        value={newNotification.comparison}
                        onChange={(value) => handleInputChange(value, 'comparison')}
                        color="blue-gray"
                        className="text-white border"
                    >
                        <Option value="LESS_THAN">Less Than</Option>
                        <Option value="GREATER_THAN">Greater Than</Option>
                    </Select>

                    <Button
                        onClick={handleCreateNotification}
                        color="blue"
                        className="w-full mt-6"
                    >
                        Create Notification
                    </Button>
                </form>
            </Card>

            <div className="overflow-y-auto max-h-96">
                {filteredNotifications.map((notification) => (
                    <Card key={notification._id} className="p-4 mb-4 bg-gray-700">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <Typography variant="h6" className="text-white">{notification.name}</Typography>
                                <Typography variant="paragraph" className="text-white">{`Furniture Name: ${notification.furnitureId.name}`}</Typography>
                                <Typography variant="paragraph" className="text-white">{`Threshold: ${notification.threshold} ${notification.comparison === 'LESS_THAN' ? 'Less Than' : 'Greater Than'}`}</Typography>
                            </div>
                            <Button
                                onClick={() => handleDeleteNotification(notification._id)}
                                color="red"
                                className="ml-4"
                            >
                                Delete
                            </Button>
                            <Button onClick={() => handleEditClick(notification)} color="yellow">Edit</Button>
                        </div>
                    </Card>
                ))}
            </div>
            {editNotification && (
                <Dialog open={modalOpen} handler={() => setModalOpen(false)}>
                    <DialogHeader>Edit Notification</DialogHeader>
                    <DialogBody>
                        <Input
                            label="Name"
                            value={editNotification.name}
                            onChange={(e) => handleEditChange(e.target.value, 'name')}
                        />
                        <Input
                            label="Threshold"
                            type="number"
                            value={editNotification.threshold}
                            onChange={(e) => handleEditChange(e.target.value, 'threshold')}
                        />
                        <Select
                            label="Comparison"
                            value={editNotification.comparison}
                            onChange={(value) => handleEditChange(value, 'comparison')}
                        >
                            <Option value="LESS_THAN">Less Than</Option>
                            <Option value="GREATER_THAN">Greater Than</Option>
                        </Select>
                        <Input
                            label="Email"
                            type="email"
                            value={editNotification.email}
                            onChange={(e) => handleEditChange(e.target.value, 'email')}
                        />
                    </DialogBody>
                    <DialogFooter>
                        <Button color="blue" onClick={handleEditSave}>Save</Button>
                        <Button color="gray" onClick={() => setModalOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </Dialog>
            )}
        </Card>
    );
};

export default NotificationsComp;