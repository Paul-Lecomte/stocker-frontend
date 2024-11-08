import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Input, Select, Typography } from "@material-tailwind/react";
import axios from "axios";
import debounce from 'lodash/debounce';  // Import debounce from lodash

const Products = () => {
    const { id } = useParams(); // Get the product ID (furnitureId) from URL params
    const navigate = useNavigate(); // For navigation
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [timePeriod, setTimePeriod] = useState("Last 30 days");
    const [stockMovements, setStockMovements] = useState([]);
    const [customStartDate, setCustomStartDate] = useState(""); // Track custom start date
    const [customEndDate, setCustomEndDate] = useState(""); // Track custom end date
    const [searchQuery, setSearchQuery] = useState(""); // Track the search query
    const [searchResults, setSearchResults] = useState([]); // Track the search results
    const [noDataFound, setNoDataFound] = useState(false); // Track if no data is found

    // Fetch product details and stock movements when furnitureId or other dependencies change
    useEffect(() => {
        if (id) {
            fetchProductById(id); // Fetch product details and stock movements by furnitureId
        }
    }, [id, timePeriod, customStartDate, customEndDate]);

    // Debounced search
    const fetchSearchResults = debounce(async (query) => {
        try {
            console.log("Searching for:", query);  // Log search query
            const response = await axios.get(`http://localhost:3000/api/furniture/search`, {
                params: { name: query },  // Send 'name' as the query parameter
                method: 'get',
                withCredentials: true
            });
            console.log("Search results:", response.data);  // Log the response data
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);  // Log any errors
        }
    }, 500);  // 500ms debounce delay

    // Handle search query change and call debounced search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);  // Update search query
        fetchSearchResults(e.target.value);  // Trigger search after debounce
    };

    const handleFurnitureSelect = (furnitureId) => {
        navigate(`/products/${furnitureId}`); // Redirect to product page
    };

    const fetchProductById = async (id) => {
        try {
            // Fetch product details by ID
            const productResponse = await axios.get(`http://localhost:3000/api/furniture/${id}`, {
                method: 'get',
                withCredentials: true
            });
            setSelectedProduct(productResponse.data);

            // Calculate date range based on selected time period or custom dates
            let startDate, endDate;
            const currentDate = new Date();

            if (customStartDate && customEndDate) {
                startDate = new Date(customStartDate);
                endDate = new Date(customEndDate);
            } else {
                switch (timePeriod) {
                    case "Last 30 days":
                        startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
                        break;
                    case "Last 3 months":
                        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
                        break;
                    case "Last year":
                        startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
                        break;
                    default:
                        startDate = currentDate;
                        break;
                }
                endDate = new Date();
            }

            // Fetch stock movements by furnitureId and date range
            const movementsResponse = await axios.get(`http://localhost:3000/api/stock-movements/${id}/movements`, {
                params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
                method: 'get',
                withCredentials: true
            });

            if (movementsResponse.data.length === 0) {
                setNoDataFound(true); // No data found for the selected period
            } else {
                setStockMovements(movementsResponse.data);
                setNoDataFound(false); // Reset if data is found
            }
        } catch (error) {
            console.error("Error fetching product details or stock movements:", error);
        }
    };

    // Prepare data for the chart
    const stockData = {
        labels: Array.isArray(stockMovements) && stockMovements.length > 0
            ? stockMovements.map((movement) => new Date(movement.createdAt).toLocaleDateString())
            : ['No movements'], // If no movements, show a placeholder label
        datasets: [
            {
                label: "Stock Level",
                data: Array.isArray(stockMovements) && stockMovements.length > 0
                    ? stockMovements.map((movement) => movement.quantity)
                    : [selectedProduct?.quantity], // If no movements, use the initial stock quantity
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    if (!selectedProduct) return <p>Loading product details...</p>;

    return (
        <Card className="p-6 bg-gray-800 text-white rounded-none">
            <div className="flex flex-col mb-4 space-y-2">
                <Typography variant="h6">{selectedProduct.name} Details</Typography>

                {/* Search Input */}
                <Input
                    label="Search Furniture"
                    value={searchQuery}
                    onChange={handleSearchChange} // Handle real-time search
                    className="mb-4"
                />

                {/* Search Results */}
                <div className="space-y-2">
                    {Array.isArray(searchResults) && searchResults.length > 0 ? (
                        searchResults.map((product) => (
                            <Typography
                                key={product._id}
                                onClick={() => handleFurnitureSelect(product._id)}
                                className="cursor-pointer hover:text-blue-400"
                            >
                                {product.name}
                            </Typography>
                        ))
                    ) : (
                        <Typography>No results found</Typography> // Show a message if no results
                    )}
                </div>

                {/* Select Time Period */}
                <Select
                    label="Select Time Period"
                    value={timePeriod}
                    onChange={(value) => setTimePeriod(value)} // Change the time period
                >
                    <Select.Option value="Last 30 days">Last 30 days</Select.Option>
                    <Select.Option value="Last 3 months">Last 3 months</Select.Option>
                    <Select.Option value="Last year">Last year</Select.Option>
                </Select>

                {/* Custom Date Range */}
                <div className="flex flex-col space-y-4 mt-4">
                    <Input
                        type="date"
                        label="Start Date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="mb-4"
                    />
                    <Input
                        type="date"
                        label="End Date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="mb-6">
                <Typography>Creation Date: {selectedProduct.createdAt}</Typography>
                <Typography>Location: {selectedProduct.location}</Typography>
                <Typography>Stock: {selectedProduct.quantity}</Typography>
                <Typography>Description: {selectedProduct.description}</Typography>
            </div>

            {/* Display message if no data found */}
            {noDataFound ? (
                <Typography className="text-red-500">No data found for the selected dates</Typography>
            ) : (
                <div>
                    <Typography variant="h6" className="mb-4">
                        Stock Level Over {timePeriod}
                    </Typography>
                    <Line
                        data={stockData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                title: { display: true, text: `Stock Levels of ${selectedProduct.name}` },
                            },
                        }}
                    />
                </div>
            )}
        </Card>
    );
};

export default Products;
