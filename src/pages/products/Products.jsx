import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getStockMovements } from '../../stores/stockMovementStore.js'; // Adjust this import path
import { Card, Input, Select, Typography } from "@material-tailwind/react";
import axios from "axios";

const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [timePeriod, setTimePeriod] = useState("Last 30 days");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [stockMovements, setStockMovements] = useState([]);

    useEffect(() => {
        fetchProductById('671df552156af3900aca449a'); // Default ID
    }, []);

    const fetchProductById = async (id) => {
        try {
            const response = await axios.get(`/api/furniture/${id}`, {
                method : 'get',
                withCredentials : true
            });
            setSelectedProduct(response.data);
            const movements = await getStockMovements(id);
            console.log("Fetched stock movements:", movements); // Log the fetched movements
            setStockMovements(movements);
        } catch (error) {
            console.error("Error fetching product details or stock movements:", error);
        }
    };

    // Prepare data for the chart
    const stockData = {
        labels: Array.isArray(stockMovements) ?
            stockMovements.map(movement => new Date(movement.date).toLocaleDateString()) : [],
        datasets: [
            {
                label: "Stock Level",
                data: Array.isArray(stockMovements) ?
                    stockMovements.map(movement => movement.quantity) : [],
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
                <Typography variant="h6">
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
                    <Select.Option value="Last 30 days">Last 30 days</Select.Option>
                    <Select.Option value="Last 3 months">Last 3 months</Select.Option>
                    <Select.Option value="Last year">Last year</Select.Option>
                </Select>
            </div>


            <div className="mb-6">
                <Typography>Creation Date: {selectedProduct.creationDate}</Typography>
                <Typography>Location: {selectedProduct.location}</Typography>
                <Typography>Stock: {selectedProduct.stock}</Typography>
                <Typography>Description: {selectedProduct.description}</Typography>
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
