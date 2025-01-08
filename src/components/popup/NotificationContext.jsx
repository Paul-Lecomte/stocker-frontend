import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();
const socket = io('http://localhost:3000', {
    withCredentials: true,
});

export const NotificationProvider = ({ children }) => {
    const [popupNotifications, setPopupNotifications] = useState([]);
    const notificationsRef = useRef(popupNotifications);

    // Request browser notification permission on load
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission().catch((err) => {
                console.error('Failed to request notification permission:', err);
            });
        }
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Frontend connected to Socket.IO server');
        });

        socket.on('disconnect', () => {
            console.log('Frontend disconnected from Socket.IO server');
        });

        socket.on('stock-level-notification', (data) => {
            const { message, furnitureId, furnitureName, threshold } = data;

            const notificationMessage = furnitureId
                ? `Product ${furnitureName} has reached the threshold of ${threshold}. ${message}`
                : message;

            const newNotification = {
                id: Date.now(),
                message: notificationMessage,
            };

            // Add popup notification
            setPopupNotifications((prev) => {
                const newNotifications = [...prev, newNotification];
                notificationsRef.current = newNotifications; // Update ref with new notifications
                return newNotifications;
            });

            // Show browser notification if permission is granted
            if (Notification.permission === 'granted') {
                const browserNotification = new Notification('Stocker Alert', {
                    body: notificationMessage,
                    icon: '/src/assets/stocker_logo.svg',
                });

                // Optionally handle click event for the browser notification
                browserNotification.onclick = () => {
                    window.focus(); // Bring the user back to your app
                };
            } else {
                console.warn('Notification permission is not granted');
            }

            // Automatically remove popup notification after 5 seconds
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
            <div className="fixed top-10 right-4 space-y-2 z-50">
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