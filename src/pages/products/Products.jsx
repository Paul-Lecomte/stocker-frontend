import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Typography, Button, Spinner, Dialog, ButtonGroup } from "@material-tailwind/react";
import axios from "axios";
import debounce from "lodash/debounce";
import Confetti from "react-confetti";

const Products = () => {
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [timePeriod, setTimePeriod] = useState("Last 30 days");
    const [stockMovements, setStockMovements] = useState([]);
    const [filteredMovements, setFilteredMovements] = useState([]);
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [noDataFound, setNoDataFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const specificWord = "confetti"

    const fetchSearchResults = debounce(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:3000/api/furniture/search`, {
                params: { name: query },
                withCredentials: true,
            });
            setSearchResults(response.data);
            setIsLoading(false);

            // Trigger confetti only if the search query matches the specific word
            if (query.toLowerCase() === specificWord.toLowerCase()) {
                setShowConfetti(true);

                // Hide confetti after 2 seconds
                setTimeout(() => {
                    setShowConfetti(false);
                }, 4000);
            }
        } catch (error) {
            setIsLoading(false);
        }
    }, 500);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        fetchSearchResults(e.target.value);
    };

    const handleFurnitureSelect = (furnitureId) => {
        fetchProductById(furnitureId);
    };

    const fetchProductById = async (id) => {
        try {
            const productResponse = await axios.get(`http://localhost:3000/api/furniture/${id}`, {
                withCredentials: true,
            });
            setSelectedProduct(productResponse.data);

            const movementsResponse = await axios.get(
                `http://localhost:3000/api/stock-movements/${id}/movements`,
                { withCredentials: true }
            );

            if (movementsResponse.data.length === 0) {
                setNoDataFound(true);
            } else {
                setStockMovements(movementsResponse.data);
                setNoDataFound(false);
            }
        } catch (error) {}
    };

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

    const chartData = {
        labels:
            Array.isArray(filteredMovements) && filteredMovements.length > 0
                ? filteredMovements.map((movement) => new Date(movement.createdAt).toLocaleDateString())
                : ["No movements"],
        datasets: [
            {
                label: "Stock Level",
                data:
                    Array.isArray(filteredMovements) && filteredMovements.length > 0
                        ? filteredMovements.map((movement) => movement.quantity)
                        : [selectedProduct?.quantity],
                fill: false,
                backgroundColor: "rgb(255, 255, 255)",
                borderColor: "rgba(255, 255, 255, 0.7)",
                tension: 0.1,
            },
        ],
    };

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

    const handleApplyDateFilter = () => {
        setFilteredMovements(stockMovements);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleIncrementStock = async (quantity) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const { first_name, last_name } = userInfo?.user || {};
            const userId = userInfo?.user?._id;
            const username = `${first_name} ${last_name}`.trim();

            const response = await axios.put(
                `http://localhost:3000/api/furniture/increment/${selectedProduct._id}`,
                { id: selectedProduct._id, quantity, username, userId },
                { withCredentials: true }
            );

            setSelectedProduct(response.data.furniture);
            fetchProductById(selectedProduct._id);
        } catch (error) {
            console.error("Error incrementing stock:", error.response?.data?.message || error.message);
        }
    };

    const handleDecrementStock = async (quantity) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const { first_name, last_name } = userInfo?.user || {};
            const userId = userInfo?.user?._id;
            const username = `${first_name} ${last_name}`.trim();

            const response = await axios.put(
                `http://localhost:3000/api/furniture/decrement/${selectedProduct._id}`,
                { id: selectedProduct._id, quantity, username, userId },
                { withCredentials: true }
            );

            setSelectedProduct(response.data.furniture);
            fetchProductById(selectedProduct._id);
        } catch (error) {
            console.error("Error decrementing stock:", error.response?.data?.message || error.message);
        }
    };

    return (
        <Card className="p-6 bg-gray-800 text-white rounded-none">
            {showConfetti && <Confetti />}
            <div className="flex flex-col mb-4 space-y-2">
                <Typography variant="h6">Product Search</Typography>
                <Input
                    label="Search Furniture"
                    color="white"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-4"
                />
                <div className="space-y-2">
                    {isLoading ? (
                        <Spinner style={{width: "20px", height: "20px"}} color="blue"/>
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
                        <span>No results found</span>
                    )}
                </div>
                <div className="flex space-x-2 mt-4">
                    <Input
                        type="date"
                        color="white"
                        label="Start Date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                    <Input
                        type="date"
                        color="white"
                        label="End Date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                    <ButtonGroup>
                        <Button onClick={() => handleIncrementStock(1)}>
                            +1 stock
                        </Button>
                        <Button onClick={() => handleDecrementStock(1)}>
                            -1 stock
                        </Button>
                    </ButtonGroup>
                </div>
                <div className="mt-6 flex">
                    <div className="overflow-x-auto w-3/4">
                        <table className="min-w-full table-auto">
                            <thead>
                            <tr className="text-left border-b">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Location</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedProduct && (
                                <tr>
                                    <td className="px-4 py-2">{selectedProduct.name}</td>
                                    <td className="px-4 py-2">{selectedProduct.quantity}</td>
                                    <td className="px-4 py-2">${selectedProduct.price}</td>
                                    <td className="px-4 py-2">{selectedProduct.location}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-6">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </Card>
    );
};

export default Products;