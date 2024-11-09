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
                    return {
                        id: product._id,
                        name: product.name,
                        movements: product.movements || [], // Ensure movements exists
                        stockHistory: product.movements.map(movement => movement.quantity), // Use quantity for stock history
                        dates: product.movements.map(movement => new Date(movement.createdAt).toLocaleDateString()), // Format dates
                    };
                });

                setProductsData(products);
                setSelectedProducts(products.map(product => product.id)); // Select all by default
                setFilteredDataWithDates(products); // Initialize the filtered data
            } catch (error) {
                console.error("Error fetching products data:", error);
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

    // Filter movements by selected date range
    const filterByDateRange = (movements) => {
        if (!movements || movements.length === 0) return []; // Return empty array if movements are undefined or empty

        if (!startDate && !endDate) return movements;

        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();

        return movements.filter(movement => {
            const movementDate = new Date(movement.createdAt); // Directly use the createdAt date

            return movementDate >= start && movementDate <= end;
        });
    };

    const handleApplyDateFilter = () => {
        // Filter products based on selected date range
        const filteredProductsData = productsData.filter(product => selectedProducts.includes(product.id));

        const filteredData = filteredProductsData.map(product => {
            const filteredMovements = filterByDateRange(product.movements);
            return {
                ...product,
                movements: filteredMovements,
                stockHistory: filteredMovements.map(movement => movement.quantity), // Adjust stock history after filtering
                dates: filteredMovements.map(movement => new Date(movement.createdAt).toLocaleDateString()), // Adjust dates after filtering
            };
        });

        setFilteredDataWithDates(filteredData);
    };

    // Extract dates for the x-axis (assuming all products share the same date sequence)
    const chartLabels = filteredDataWithDates[0]?.dates || [];

    const chartData = {
        labels: chartLabels,
        datasets: filteredDataWithDates.map((product, index) => ({
            label: product.name,
            data: product.stockHistory,
            fill: false,
            backgroundColor: `hsl(${index * 70}, 70%, 50%)`,
            borderColor: `hsl(${index * 70}, 70%, 70%)`,
        })),
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Card className="rounded-none p-6 bg-gray-800 text-white">
            <Typography variant="h6" className="mb-4">Full Inventory</Typography>

            {/* Date Filter */}
            <div className="flex mb-4">
                <Input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleDateChange}
                    className="mr-4"
                    label="Start Date"
                />
                <Input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleDateChange}
                    className="mr-4"
                    label="End Date"
                />
                {/* Button to apply date filter */}
                <Button color="blue" onClick={handleApplyDateFilter}>Apply Date Filter</Button>
            </div>

            {/* Product Selection */}
            <div className="flex flex-col mb-4">
                <Typography variant="small">Select products to display on the graph:</Typography>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {productsData.map(product => (
                        <label key={product.id} className="flex items-center space-x-2">
                            <Checkbox
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleToggleProduct(product.id)}
                                color="blue"
                            />
                            <span>{product.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <Typography variant="h6" className="mb-2">Inventory Table</Typography>
                <table className="min-w-full text-left text-sm">
                    <thead>
                    <tr className="bg-gray-700">
                        <th className="p-3">Name</th>
                        <th className="p-3">Stock History</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredDataWithDates.map((product) => (
                        <tr key={product.id} className={product.id % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                            <td className="p-3">{product.name}</td>
                            <td className="p-3">{product.stockHistory.join(', ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Typography variant="h6" className="mb-4">Stock Level Over Time</Typography>
            <Line data={chartData} options={{
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: "Stock Levels of Selected Products" },
                },
            }} />
        </Card>
    );
};

export default Movement;
