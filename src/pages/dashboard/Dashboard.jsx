import React, { useEffect } from 'react';
import { Card, Typography } from "@material-tailwind/react";
import { useFurnitureStore } from '../../stores/furnitureStore.js';

const Dashboard = () => {
    const {
        productCount = 0, // Ensure a default value of 0
        fetchDashboardData,
        furnitureLoading,
        error
    } = useFurnitureStore();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (furnitureLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col items-center space-y-6 min-h-screen text-white">
            <Typography variant="h2" className="text-blue-400 mb-4">Dashboard</Typography>

            <div className="flex space-x-6">
                <Card className="text-center p-6 w-40" style={{ background: "#212D3B", color: "#FFFFFF" }}>
                    <Typography variant="h3" style={{ color: "#54A1DB" }}>{productCount}</Typography> {/* Use productCount here */}
                    <Typography>Products</Typography>
                </Card>
                <Card className="text-center p-6 w-40" style={{ background: "#212D3B", color: "#FFFFFF" }}>
                    <Typography variant="h3" style={{ color: "#54A1DB" }}>test</Typography>
                    <Typography>Users</Typography>
                </Card>
            </div>

            <Card className="w-full max-w-3xl p-4 bg-gray-800">
                <Typography variant="h5" className="mb-4 text-center">Most Sold Products</Typography>
            </Card>

            <Card className="w-full max-w-3xl p-4 bg-gray-800">
                <Typography variant="h5" className="mb-4 text-center">Highest Price Products</Typography>
            </Card>
        </div>
    );
};

export default Dashboard;
