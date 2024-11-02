import React, { useState, useEffect } from 'react';
import { Card, Typography, Select, Option, Input } from "@material-tailwind/react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [timePeriod, setTimePeriod] = useState("Last 30 days");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Fetch a default product or specific ID on load
        fetchProductById(1); // Replace with actual initial ID if needed
    }, []);

    const fetchProductById = (id) => {
        axios.get(`/api/furniture/${id}`)
            .then((response) => setSelectedProduct(response.data))
            .catch((error) => console.error("Error fetching furniture details:", error));
    };

    const handleSearch = () => {
        axios.get(`/api/furniture/search?name=${searchTerm}`)
            .then((response) => setSearchResults(response.data))
            .catch((error) => console.error("Error fetching search results:", error));
    };

    const stockData = {
        labels: ["2024-03-01", "2024-03-08", "2024-03-15", "2024-03-22", "2024-03-29"],
        datasets: [
            {
                label: "Stock Level",
                data: [150, 120, 90, 110, 100],
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    if (!selectedProduct) return <p>Loading product details...</p>;

    return (
        <Card className="p-6 bg-gray-800 text-white rounded-none">
            <div className="flex flex-col mb-4">
                <Typography variant="h6" color="gray-300">
                    {selectedProduct.name} Details
                </Typography>
                <Input
                    label="Search Furniture"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="mb-4"
                />
                <span className="mt-3"></span>
                {searchResults.map((result) => (
                    <div key={result._id} onClick={() => fetchProductById(result._id)}>
                        <Typography variant="body1" className="cursor-pointer">{result.name}</Typography>
                    </div>
                ))}
                <Select
                    label="Select Time Period"
                    value={timePeriod}
                    onChange={(value) => setTimePeriod(value)}
                >
                    <Option value="Last 30 days">Last 30 days</Option>
                    <Option value="Last 3 months">Last 3 months</Option>
                    <Option value="Last year">Last year</Option>
                </Select>
            </div>

            <div className="mb-6">
                <Typography variant="subtitle1">Creation Date: {selectedProduct.creationDate}</Typography>
                <Typography variant="subtitle1">Location: {selectedProduct.location}</Typography>
                <Typography variant="subtitle1">Stock: {selectedProduct.stock}</Typography>
                <Typography variant="subtitle1">Description: {selectedProduct.description}</Typography>
            </div>

            <div>
                <Typography variant="h6" className="mb-4">
                    Stock Level Over {timePeriod}
                </Typography>
                <Line data={stockData} options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: `Stock Levels of ${selectedProduct.name}` },
                    },
                }} />
            </div>
        </Card>
    );
};

export default Products;
