import React, { useState } from 'react';
import { Card, Typography, Button, Input, Select, Option } from "@material-tailwind/react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Products = () => {
    const [productData, setProductData] = useState([
        { id: 1, name: "Product A", creationDate: "2024.03.24", location: "Aisle 1", stock: 150 },
        { id: 2, name: "Product B", creationDate: "2024.03.25", location: "Aisle 2", stock: 90 },
        // Add more products as needed
    ]);

    const [selectedProduct, setSelectedProduct] = useState(productData[0]);
    const [timePeriod, setTimePeriod] = useState("Last 30 days");

    const handleProductSelect = (id) => {
        const product = productData.find((prod) => prod.id === id);
        setSelectedProduct(product);
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

    return (
        <Card className="p-6 bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" color="gray-300">
                    Products
                </Typography>
                <Select
                    label="Select Time Period"
                    value={timePeriod}
                    onChange={(value) => setTimePeriod(value)} // Accessing the value directly
                >
                    <Option value="Last 30 days">Last 30 days</Option>
                    <Option value="Last 3 months">Last 3 months</Option>
                    <Option value="Last year">Last year</Option>
                </Select>
            </div>

            <div className="flex gap-6">
                {/* Product Info Table */}
                <div className="w-1/2">
                    <Typography variant="h6" className="mb-4">
                        Product Information
                    </Typography>
                    <table className="min-w-full text-left text-sm">
                        <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3">Name</th>
                            <th className="p-3">Creation Date</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productData.map((product) => (
                            <tr key={product.id} className={product.id % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.creationDate}</td>
                                <td className="p-3">{product.location}</td>
                                <td className="p-3">{product.stock}</td>
                                <td className="p-3">
                                    <Button size="sm" color="blue" onClick={() => handleProductSelect(product.id)}>
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Stock Level Graph */}
                <div className="w-1/2">
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
            </div>
        </Card>
    );
};

export default Products;
