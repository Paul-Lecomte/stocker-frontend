import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();
const socket = io('http://localhost:3000', {
    withCredentials: true,
});

export const NotificationProvider = ({ children }) => {
    const [popupNotifications, setPopupNotifications] = useState([]);
    const notificationsRef = useRef(popupNotifications); // Use a ref to track notifications

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Frontend connected to Socket.IO server');
        });

        socket.on('disconnect', () => {
            console.log('Frontend disconnected from Socket.IO server');
        });

        socket.on('stock-level-notification', (data) => {
            console.log('Notification triggered:', data);
            const { message, furnitureId, threshold } = data;

            const notificationMessage = furnitureId
                ? `Product ${furnitureId} has reached the threshold of ${threshold}. ${message}`
                : message;

            const newNotification = {
                id: Date.now(),
                message: notificationMessage,
            };

            setPopupNotifications((prev) => {
                const newNotifications = [...prev, newNotification];
                notificationsRef.current = newNotifications; // Update ref with new notifications
                return newNotifications;
            });

            // Automatically remove notification after 5 seconds
            const timeoutId = setTimeout(() => {
                setPopupNotifications((prev) =>
                    prev.filter((popup) => popup.id !== newNotification.id)
                );
            }, 5000);

            // Add timeoutId to the notification for cleanup
            newNotification.timeoutId = timeoutId;
        });

        return () => {
            // Cleanup socket listeners
            socket.off('connect');
            socket.off('disconnect');
            socket.off('stock-level-notification');

            // Cleanup timeouts for notifications
            notificationsRef.current.forEach((popup) => clearTimeout(popup.timeoutId));
        };
    }, []); // Run effect only once on mount

    return (
        <NotificationContext.Provider value={{ addPopupNotification: setPopupNotifications }}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {popupNotifications.map((popup) => (
                    <div key={popup.id} className="p-4 bg-blue-500 text-white rounded shadow-lg">
                        {popup.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);