import React, { useEffect, useState } from 'react';
import {Card, Spinner, Typography} from "@material-tailwind/react";
import { useFurnitureStore } from '../../stores/furnitureStore.js';
import axios from "axios";

const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'
];

const Dashboard = () => {
    const {
        furnitureCount = 0,
        userCount = 0,
        fetchDashboardData,
        furnitureLoading,
        error
    } = useFurnitureStore();

    const [mostSoldProducts, setMostSoldProducts] = useState([]);
    const [highestPriceProducts, setHighestPriceProducts] = useState([]);
    const [isKonamiActive, setIsKonamiActive] = useState(false);

    useEffect(() => {
        // Fetch the dashboard data
        fetchDashboardData();

        // Fetch Most Sold ProductsDetails
        const fetchMostSold = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/furniture/most-sold', {
                    method: 'get',
                    withCredentials: true
                });
                setMostSoldProducts(response.data);
            } catch (error) {
                console.error("Error fetching most sold products details", error);
            }
        };

        // Fetch Highest Price ProductsDetails
        const fetchHighestPrice = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/furniture/highest-price', {
                    method: 'get',
                    withCredentials: true
                });
                setHighestPriceProducts(response.data);
            } catch (error) {
                console.error("Error fetching highest price products details", error);
            }
        };

        fetchMostSold();
        fetchHighestPrice();
    }, [fetchDashboardData]);

    useEffect(() => {
        let konamiIndex = 0;
        const handleKeyPress = (event) => {
            if (event.key === KONAMI_CODE[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === KONAMI_CODE.length) {
                    setIsKonamiActive(true);
                    setTimeout(() => setIsKonamiActive(false), 5000);
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    if (furnitureLoading)
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner className="h-12 w-12"/>
            </div>
        );
    if (error) return <div className="text-white">Error: {error}</div>;

    return (
        <div
            className="flex flex-col items-center space-y-6 min-h-screen text-white"
            style={{
                background: isKonamiActive
                    ? "linear-gradient(135deg, #ff00cc, #00ffff)" // Cyberpunk colors
                    : "#101923"
            }}
        >
            <Typography variant="h2" className="text-blue-400 mb-4 mt-4">Dashboard</Typography>

            <div className="flex space-x-6">
                <Card className="text-center p-6 w-40" style={{ background: "#212D3B", color: "#FFFFFF" }}>
                    <Typography variant="h3" style={{ color: "#54A1DB" }}>{furnitureCount}</Typography>
                    <Typography className="text-white">Furniture Count</Typography>
                </Card>
                <Card className="text-center p-6 w-40" style={{ background: "#212D3B", color: "#FFFFFF" }}>
                    <Typography variant="h3" style={{ color: "#54A1DB" }}>{userCount}</Typography>
                    <Typography className="text-white">Users</Typography>
                </Card>
            </div>

            {/* Flex container to display the tables side by side */}
            <div className="flex space-x-6 w-full max-w-7xl">
                {/* Most Sold ProductsDetails Table */}
                <Card className="w-1/2 p-4 bg-gray-800">
                    <Typography variant="h5" className="mb-4 text-center text-white">Most Stock Products</Typography>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg">
                            <thead>
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-medium text-gray-300">Product Name</th>
                                <th className="py-3 px-6 text-left text-sm font-medium text-gray-300">Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mostSoldProducts.map((product, index) => (
                                <tr key={product._id} className={`border-t border-gray-600 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
                                    <td className="py-3 px-6 text-sm text-gray-200">{product.name}</td>
                                    <td className="py-3 px-6 text-sm text-gray-200">{product.movement}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Highest Price ProductsDetails Table */}
                <Card className="w-1/2 p-4 bg-gray-800">
                    <Typography variant="h5" className="mb-4 text-center text-white">Highest Price Products</Typography>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg">
                            <thead>
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-medium text-gray-300">Product Name</th>
                                <th className="py-3 px-6 text-left text-sm font-medium text-gray-300">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {highestPriceProducts.map((product, index) => (
                                <tr key={product._id} className={`border-t border-gray-600 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
                                    <td className="py-3 px-6 text-sm text-gray-200">{product.name}</td>
                                    <td className="py-3 px-6 text-sm text-gray-200">${product.price.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;