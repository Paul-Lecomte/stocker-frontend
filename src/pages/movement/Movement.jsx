import React, { useState, useEffect } from 'react';
import {Card, Typography, Input, Button, Spinner} from "@material-tailwind/react";
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './styles.css';
import {useFurnitureStore} from "../../stores/furnitureStore.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Movement = () => {
    const [productsData, setProductsData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredDataWithDates, setFilteredDataWithDates] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const { furnitureLoading } = useFurnitureStore();

    // Fetch products data
    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stock-movements/all', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userInfo')?.token || ''}` },
                    withCredentials: true,
                });

                const data = Array.isArray(response.data) ? response.data : [];

                const products = data.map(product => {
                    const latestMovementDate = product.movements.length
                        ? new Date(product.movements[0].createdAt).toLocaleDateString()
                        : 'N/A';

                    const latestStockQuantity = product.movements.length
                        ? product.movements[0].quantity
                        : product.quantity;

                    return {
                        id: product._id,
                        name: product.name,
                        movements: product.movements || [],
                        latestMovementDate,
                        latestStockQuantity,
                    };
                });

                // Set default date range
                const now = new Date();
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(now.getDate() - 14);

                const defaultStartDate = twoWeeksAgo.toISOString().split('T')[0];
                const defaultEndDate = now.toISOString().split('T')[0];

                setStartDate(defaultStartDate);
                setEndDate(defaultEndDate);
                setProductsData(products);
                setSelectedProducts(products.map(product => product.id));

                const filteredData = products.map(product => {
                    const filteredMovements = product.movements.filter(movement => {
                        const movementDate = new Date(movement.createdAt);
                        return movementDate >= twoWeeksAgo && movementDate <= now;
                    });

                    return {
                        ...product,
                        movements: filteredMovements,
                        latestMovementDate: filteredMovements.length
                            ? new Date(filteredMovements[0].createdAt).toLocaleDateString()
                            : 'N/A',
                        latestStockQuantity: filteredMovements.length
                            ? filteredMovements[0].quantity
                            : product.latestStockQuantity,
                    };
                });

                setFilteredDataWithDates(filteredData);
            } catch (error) {
                console.error("Error fetching products data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsData();
    }, []);

    // Handle button combination (Ctrl + Shift + B)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 10000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    const handleApplyDateFilter = () => {
        const filteredProductsData = productsData.filter(product => selectedProducts.includes(product.id));

        const filteredData = filteredProductsData.map(product => {
            const filteredMovements = product.movements.filter(movement => {
                const movementDate = new Date(movement.createdAt);
                const start = startDate ? new Date(startDate) : new Date('1970-01-01');
                const end = endDate ? new Date(endDate) : new Date();
                return movementDate >= start && movementDate <= end;
            });

            return {
                ...product,
                movements: filteredMovements,
                latestMovementDate: filteredMovements.length ? new Date(filteredMovements[0].createdAt).toLocaleDateString() : 'N/A',
                latestStockQuantity: filteredMovements.length ? filteredMovements[0].quantity : product.latestStockQuantity,
            };
        });

        setFilteredDataWithDates(filteredData);
    };

    if (loading) return <p>Loading...</p>;

    const chartLabels = filteredDataWithDates[0]?.movements.map(movement => new Date(movement.createdAt).toLocaleDateString()) || ['Current Quantity'];

    const chartData = {
        labels: chartLabels,
        datasets: filteredDataWithDates.map((product, index) => ({
            label: product.name,
            data: product.movements.length
                ? product.movements.map(movement => movement.quantity)
                : [product.latestStockQuantity],
            fill: false,
            backgroundColor: `hsl(${index * 70}, 70%, 50%)`,
            borderColor: `hsl(${index * 70}, 70%, 70%)`,
        })),
    };

    if (furnitureLoading)
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner className="h-12 w-12"/>
            </div>
        );

    return (
        <Card className={`rounded-none p-6 bg-gray-800 text-white ${isAnimating ? 'animate-pulse' : ''}`}>
            <Typography variant="h6" className="mb-4">Full Inventory</Typography>

            <div className="flex mb-4">
                <Input
                    type="date"
                    name="startDate"
                    color="white"
                    value={startDate}
                    onChange={handleDateChange}
                    className="mr-4"
                    label="Start Date"
                />
                <Input
                    type="date"
                    name="endDate"
                    color="white"
                    value={endDate}
                    onChange={handleDateChange}
                    className="mr-4"
                    label="End Date"
                />
            </div>
            <Button onClick={handleApplyDateFilter}>Apply Date Filter</Button>

            <div className="mb-6">
                <Typography variant="h6" className="mb-2">Inventory Table</Typography>
                <div className="overflow-x-auto max-h-64">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3">Name</th>
                            <th className="p-3">Latest Movement Date</th>
                            <th className="p-3">Current Stock Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredDataWithDates.map((product, index) => (
                            <tr key={product.id} className={index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.latestMovementDate}</td>
                                <td className="p-3">{product.latestStockQuantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Typography variant="h6" className="mb-4">Stock Level Over Time</Typography>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {position: 'top', labels: {color: 'white'}},
                        title: {display: true, color: 'white', text: 'Stock Levels of Selected Products'},
                    },
                    scales: {
                        x: {
                            ticks: {color: 'white'},
                            grid: {color: 'rgba(255, 255, 255, 0.2)'}
                        },
                        y: {
                            ticks: {color: 'white'},
                            grid: {color: 'rgba(255, 255, 255, 0.2)'}
                        }
                    }
                }}
            />
        </Card>
    );
};

export default Movement;