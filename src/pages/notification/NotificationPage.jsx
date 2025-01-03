import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option,
} from '@material-tailwind/react';

const NotificationsComp = () => {
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState({
        furnitureId: '',
        threshold: '',
        comparison: 'LESS_THAN',
    });
    const [activeTab, setActiveTab] = useState('created');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNotificationId, setSelectedNotificationId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFurniture, setFilteredFurniture] = useState([]);
    const [furnitureName, setFurnitureName] = useState('');

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Retrieve userId from localStorage
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const userId = userInfo?.user?._id;

                if (!userId) {
                    console.error("User not found in localStorage");
                    return;
                }

                console.log("Fetching notifications for user:", userId);
                const response = await axios.get(`http://localhost:3000/api/notifications/user/${userId}`, {
                    withCredentials: true,
                });
                setNotifications(response.data.notifications || []);
                console.log("Fetched notifications:", response.data.notifications);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    // Handle form input change
    const handleInputChange = (value, name) => {
        setNewNotification((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(`Updated ${name}:`, value);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterFurniture(query);
        console.log("Search query updated:", query);
    };

    // Fetch and filter furniture based on search query
    const filterFurniture = async (query) => {
        if (query) {
            try {
                console.log("Searching furniture with query:", query);
                const response = await axios.get('http://localhost:3000/api/furniture/search', {
                    params: { name: query },
                    withCredentials: true,
                });
                setFilteredFurniture(response.data);
                console.log("Filtered furniture:", response.data);
            } catch (error) {
                console.error('Failed to search furniture:', error);
            }
        } else {
            setFilteredFurniture([]);
            console.log("No search query, clearing filtered furniture.");
        }
    };

    // Handle furniture selection from search result
    const handleFurnitureSelect = (furniture) => {
        setNewNotification((prev) => ({
            ...prev,
            furnitureId: furniture._id,
        }));
        setFurnitureName(furniture.name);
        setSearchQuery('');
        setFilteredFurniture([]);
        console.log("Selected furniture:", furniture);
    };

    // Create a new notification
    const handleCreateNotification = async () => {
        // Convert threshold to number before sending to backend
        const notificationData = {
            ...newNotification,
            threshold: Number(newNotification.threshold), // Convert to number
        };

        console.log("Creating notification with data:", notificationData);

        try {
            // Retrieve userId from localStorage for the notification
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const userId = userInfo?.user?._id;

            if (!userId) {
                console.error("User ID not found in localStorage.");
                return;
            }

            const response = await axios.post('http://localhost:3000/api/notifications', {
                ...notificationData,
                userId: userId, // Send userId with notification data
            }, {
                withCredentials: true,
            });
            setNotifications((prev) => [...prev, response.data.notification]);
            setNewNotification({ furnitureId: '', threshold: '', comparison: 'LESS_THAN' });

            // Trigger a browser notification
            if (window.Notification && Notification.permission === "granted") {
                new window.Notification("New notification created!", {
                    body: `Furniture ID: ${notificationData.furnitureId} - Threshold: ${notificationData.threshold}`,
                });
                console.log("Browser notification triggered.");
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new window.Notification("New notification created!", {
                            body: `Furniture ID: ${notificationData.furnitureId} - Threshold: ${notificationData.threshold}`,
                        });
                        console.log("Browser notification triggered after permission.");
                    }
                });
            }
        } catch (error) {
            console.error('Failed to create notification:', error);
        }
    };

    // Delete a notification
    const handleDeleteNotification = async (id) => {
        console.log("Deleting notification with ID:", id);
        try {
            await axios.delete(`http://localhost:3000/api/notifications/${id}`, {
                withCredentials: true,
            });
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            console.log("Notification deleted successfully.");
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    // Filter notifications based on their activation status
    const filteredNotifications = (notifications || []).filter((notification) => {
        return activeTab === 'created'
            ? !notification.isActivated
            : notification.isActivated;
    });

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
                        label="Threshold"
                        name="threshold"
                        value={newNotification.threshold}
                        onChange={e => handleInputChange(e.target.value, 'threshold')}
                        required
                        color="blue-gray"
                        className="text-white bg-gray-800 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        onInput={(e) => {
                            // Restrict input to numbers only (no special characters)
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                    />

                    <Select
                        label="Comparison"
                        name="comparison"
                        value={newNotification.comparison}
                        onChange={(value) => handleInputChange(value, 'comparison')} // Directly pass value and name
                        color="blue-gray"
                        className="text-white border"
                    >
                        <Option value="LESS_THAN">Less Than</Option>
                        <Option value="GREATER_THAN">Greater Than</Option>
                    </Select>
                    <Button onClick={handleCreateNotification} className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600">
                        Create Notification
                    </Button>
                </form>
            </Card>

            {activeTab === 'created' && (
                <div>
                    {filteredNotifications.map((notification) => (
                        <Card key={notification._id} className="mb-6 p-4 bg-gray-700 rounded-md">
                            <Typography variant="h6" className="text-white">
                                Furniture: {notification.furnitureId} | Threshold: {notification.threshold}
                            </Typography>
                            <Button
                                onClick={() => handleDeleteNotification(notification._id)}
                                className="mt-4 bg-red-500 hover:bg-red-600"
                            >
                                Delete
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default NotificationsComp;