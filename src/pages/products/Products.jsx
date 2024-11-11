import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Typography, Button, Spinner } from "@material-tailwind/react";
import axios from "axios";
import debounce from "lodash/debounce"; // Import debounce from lodash

const Products = () => {
    const navigate = useNavigate(); // For navigation
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [timePeriod, setTimePeriod] = useState("Last 30 days");
    const [stockMovements, setStockMovements] = useState([]);
    const [filteredMovements, setFilteredMovements] = useState([]);
    const [customStartDate, setCustomStartDate] = useState(""); // Track custom start date
    const [customEndDate, setCustomEndDate] = useState(""); // Track custom end date
    const [searchQuery, setSearchQuery] = useState(""); // Track the search query
    const [searchResults, setSearchResults] = useState([]); // Track the search results
    const [noDataFound, setNoDataFound] = useState(false); // Track if no data is found
    const [isLoading, setIsLoading] = useState(false); // Track loading state for search

    // Debounced search
    const fetchSearchResults = debounce(async (query) => {
        if (!query.trim()) {
            setSearchResults([]); // Clear search results if query is empty
            return;
        }

        try {
            setIsLoading(true); // Start loading
            const response = await axios.get(`http://localhost:3000/api/furniture/search`, {
                params: { name: query }, // Send 'name' as the query parameter
                method: "get",
                withCredentials: true,
            });
            setSearchResults(response.data);
            setIsLoading(false); // End loading
        } catch (error) {
            setIsLoading(false); // End loading even if there's an error
        }
    }, 500); // 500ms debounce delay

    // Handle search query change and call debounced search
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update search query
        fetchSearchResults(e.target.value); // Trigger search after debounce
    };

    const handleFurnitureSelect = (furnitureId) => {
        fetchProductById(furnitureId); // Fetch product details and stock movements by furnitureId
    };

    const fetchProductById = async (id) => {
        try {
            // Fetch product details by ID
            const productResponse = await axios.get(`http://localhost:3000/api/furniture/${id}`, {
                method: "get",
                withCredentials: true,
            });
            setSelectedProduct(productResponse.data);

            // Fetch all stock movements by furnitureId
            const movementsResponse = await axios.get(
                `http://localhost:3000/api/stock-movements/${id}/movements`,
                {
                    method: "get",
                    withCredentials: true,
                }
            );

            if (movementsResponse.data.length === 0) {
                setNoDataFound(true); // No data found
            } else {
                setStockMovements(movementsResponse.data);
                setNoDataFound(false); // Reset if data is found
            }
        } catch (error) {
            // Handle error (no logs required)
        }
    };

    // Filter movements based on time period or custom dates
    useEffect(() => {
        if (stockMovements.length === 0) return;

        let filtered = [...stockMovements];
        const currentDate = new Date();

        if (customStartDate && customEndDate) {
            const startDate = new Date(customStartDate);
            const endDate = new Date(customEndDate);
            filtered = filtered.filter(
                (movement) =>
                    new Date(movement.createdAt) >= startDate && new Date(movement.createdAt) <= endDate
            );
        } else {
            switch (timePeriod) {
                case "Last 30 days":
                    filtered = filtered.filter(
                        (movement) =>
                            new Date(movement.createdAt) >= new Date(currentDate.setDate(currentDate.getDate() - 30))
                    );
                    break;
                case "Last 3 months":
                    filtered = filtered.filter(
                        (movement) =>
                            new Date(movement.createdAt) >= new Date(currentDate.setMonth(currentDate.getMonth() - 3))
                    );
                    break;
                case "Last year":
                    filtered = filtered.filter(
                        (movement) =>
                            new Date(movement.createdAt) >= new Date(currentDate.setFullYear(currentDate.getFullYear() - 1))
                    );
                    break;
                default:
                    break;
            }
        }
        setFilteredMovements(filtered);
    }, [stockMovements, timePeriod, customStartDate, customEndDate]);

    // Prepare data for the chart
    const chartData = {
        labels:
            Array.isArray(filteredMovements) && filteredMovements.length > 0
                ? filteredMovements.map((movement) => new Date(movement.createdAt).toLocaleDateString())
                : ["No movements"], // If no movements, show a placeholder label
        datasets: [
            {
                label: "Stock Level",
                data:
                    Array.isArray(filteredMovements) && filteredMovements.length > 0
                        ? filteredMovements.map((movement) => movement.quantity)
                        : [selectedProduct?.quantity], // If no movements, use the initial stock quantity
                fill: false,
                backgroundColor: "rgb(255, 255, 255)", // White background color for the line
                borderColor: "rgba(255, 255, 255, 0.7)", // Light white border for the line
                tension: 0.1,
            },
        ],
    };

    // Chart options with the provided customization
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top", labels: { color: "white" } },
            title: { display: true, color: "white", text: "Stock Levels of Selected Products" },
        },
        scales: {
            x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255, 255, 255, 0.2)" },
            },
            y: {
                ticks: { color: "white" },
                grid: { color: "rgba(255, 255, 255, 0.2)" },
            },
        },
    };

    // Handle date range application
    const handleApplyDateFilter = () => {
        setFilteredMovements(stockMovements); // Re-filter movements based on selected dates or time period
    };

    // Handle redirect to product details page
    const handleGoToProductDetails = () => {
        if (selectedProduct) {
            navigate(`/products_details/${selectedProduct._id}`); // Navigate to product details page with the selected product ID
        }
    };

    return (
        <Card className="p-6 bg-gray-800 text-white rounded-none">
            <div className="flex flex-col mb-4 space-y-2">
                <Typography variant="h6">Product Search</Typography>

                {/* Search Input */}
                <Input
                    label="Search Furniture"
                    color="white"
                    value={searchQuery}
                    onChange={handleSearchChange} // Handle real-time search
                    className="mb-4"
                />

                {/* Search Results */}
                <div className="space-y-2">
                    {isLoading ? (
                        <Spinner className="h-10 w-10" color="blue" /> // Loading state
                    ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
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
                        <span>No results found</span> // Show a message if no results
                    )}
                </div>

                {/* Custom Date Range */}
                <div className="flex space-x-2 mt-4">
                    <Input
                        type="date"
                        color="white"
                        label="Start Date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)} // Track custom start date
                    />
                    <Input
                        type="date"
                        color="white"
                        label="End Date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)} // Track custom end date
                    />
                    <Button onClick={handleApplyDateFilter}>Apply</Button>
                </div>

                {/* Furniture Details Table */}
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                        <tr className="text-left border-b">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedProduct && (
                            <tr>
                                <td className="px-4 py-2">{selectedProduct.name}</td>
                                <td className="px-4 py-2">{selectedProduct.quantity}</td>
                                <td className="px-4 py-2">${selectedProduct.price}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Button to go to Product Details Page */}
                <Button color="blue" className="mt-4" onClick={handleGoToProductDetails}>
                    View Product Details
                </Button>
            </div>

            {/* Chart */}
            <div className="mt-6">
                <Line data={chartData} options={chartOptions} />
            </div>
        </Card>
    );
};

export default Products;