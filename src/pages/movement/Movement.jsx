import React, { useState, useEffect } from 'react';
import { Card, Typography, Checkbox, Input, Button } from "@material-tailwind/react";
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Movement = () => {
    const [productsData, setProductsData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredDataWithDates, setFilteredDataWithDates] = useState([]);

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
                        : 'N/A';

                    return {
                        id: product._id,
                        name: product.name,
                        movements: product.movements || [],
                        latestMovementDate,
                        latestStockQuantity,
                    };
                });

                setProductsData(products);
                setSelectedProducts(products.map(product => product.id)); // Select all by default
                setFilteredDataWithDates(products); // Initialize the filtered data
            } catch (error) {
                console.error("Error fetching products_details data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsData();
    }, []);

    const handleToggleProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

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
                latestStockQuantity: filteredMovements.length ? filteredMovements[0].quantity : 'N/A',
            };
        });

        setFilteredDataWithDates(filteredData);
    };

    if (loading) return <p>Loading...</p>;

    // Chart Data
    const chartLabels = filteredDataWithDates[0]?.movements.map(movement => new Date(movement.createdAt).toLocaleDateString()) || [];

    const chartData = {
        labels: chartLabels,
        datasets: filteredDataWithDates.map((product, index) => ({
            label: product.name,
            data: product.movements.map(movement => movement.quantity), // Showing historical stock quantities
            fill: false,
            backgroundColor: `hsl(${index * 70}, 70%, 50%)`,
            borderColor: `hsl(${index * 70}, 70%, 70%)`,
        })),
    };

    return (
        <Card className="rounded-none p-6 bg-gray-800 text-white">
            <Typography variant="h6" className="mb-4">Full Inventory</Typography>

            {/* Date Filter */}
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
            <Button color="blue" onClick={handleApplyDateFilter}>Apply Date Filter</Button>

            <div className="mb-6">
                <Typography variant="h6" className="mb-2">Inventory Table</Typography>
                {/* Table wrapper with horizontal and vertical scrolling */}
                <div className="overflow-x-auto max-h-64">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3">Name</th>
                            <th className="p-3">Latest Movement Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredDataWithDates.map((product) => (
                            <tr key={product.id} className="bg-gray-700">
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.latestMovementDate}</td>
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
                        legend: { position: 'top', labels: { color: 'white' } },
                        title: { display: true, color: 'white', text: 'Stock Levels of Selected ProductsDetails' },
                    },
                    scales: {
                        x: {
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255, 255, 255, 0.2)' }
                        },
                        y: {
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255, 255, 255, 0.2)' }
                        }
                    }
                }}
            />
        </Card>
    );
};

export default Movement;