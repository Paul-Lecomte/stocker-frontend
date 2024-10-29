import React, { useState } from 'react';
import { Card, Typography, Checkbox } from "@material-tailwind/react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Movement = () => {
    const productsData = [
        { id: 1, name: "Product A", stockHistory: [150, 120, 90, 110, 100] },
        { id: 2, name: "Product B", stockHistory: [100, 110, 115, 120, 95] },
        { id: 3, name: "Product C", stockHistory: [200, 190, 180, 170, 160] },
        // Add more products as needed
    ];

    const [selectedProducts, setSelectedProducts] = useState(productsData.map(product => product.id));

    const handleToggleProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const filteredProductsData = productsData.filter(product => selectedProducts.includes(product.id));

    const chartData = {
        labels: ["2024-03-01", "2024-03-08", "2024-03-15", "2024-03-22", "2024-03-29"],
        datasets: filteredProductsData.map((product, index) => ({
            label: product.name,
            data: product.stockHistory,
            fill: false,
            backgroundColor: `hsl(${index * 70}, 70%, 50%)`,
            borderColor: `hsl(${index * 70}, 70%, 70%)`,
        })),
    };

    return (
        <Card className="rounded-none p-6 bg-gray-800 text-white">
            <Typography variant="h6" color="gray-300" className="mb-4">
                Full Inventory
            </Typography>

            {/* Product Selection */}
            <div className="flex flex-col mb-4">
                <Typography variant="small" color="gray-300">
                    Select products to display on the graph:
                </Typography>
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

            {/* Inventory Table */}
            <div className="mb-6">
                <Typography variant="h6" className="mb-2">
                    Inventory Table
                </Typography>
                <table className="min-w-full text-left text-sm">
                    <thead>
                    <tr className="bg-gray-700">
                        <th className="p-3">Name</th>
                        <th className="p-3">Stock History</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productsData.map((product) => (
                        <tr key={product.id} className={product.id % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                            <td className="p-3">{product.name}</td>
                            <td className="p-3">{product.stockHistory.join(', ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Stock History Graph */}
            <Typography variant="h6" className="mb-4">
                Stock Level Over Time
            </Typography>
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
