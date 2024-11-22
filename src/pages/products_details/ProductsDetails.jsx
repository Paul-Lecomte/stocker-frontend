import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Input, Select, Typography, Button, Spinner, Dialog } from "@material-tailwind/react"; // Import Dialog
import axios from "axios";
import debounce from "lodash/debounce";

const ProductsDetails = () => {
    const { id } = useParams();
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

    useEffect(() => {
        if (id) {
            fetchProductById(id);
        }
    }, [id, timePeriod, customStartDate, customEndDate]);

    const fetchSearchResults = debounce(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:3000/api/furniture/search`, {
                params: { name: query },
                method: "get",
                withCredentials: true,
            });
            setSearchResults(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }, 500);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        fetchSearchResults(e.target.value);
    };

    const handleFurnitureSelect = (furnitureId) => {
        navigate(`/products_details/${furnitureId}`);
    };

    const fetchProductById = async (id) => {
        try {
            const productResponse = await axios.get(`http://localhost:3000/api/furniture/${id}`, {
                method: "get",
                withCredentials: true,
            });
            setSelectedProduct(productResponse.data);

            const movementsResponse = await axios.get(`http://localhost:3000/api/stock-movements/${id}/movements`, {
                method: "get",
                withCredentials: true,
            });

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
                (movement) => new Date(movement.createdAt) >= startDate && new Date(movement.createdAt) <= endDate
            );
        } else {
            switch (timePeriod) {
                case "Last 30 days":
                    filtered = filtered.filter(
                        (movement) => new Date(movement.createdAt) >= new Date(currentDate.setDate(currentDate.getDate() - 30))
                    );
                    break;
                case "Last 3 months":
                    filtered = filtered.filter(
                        (movement) => new Date(movement.createdAt) >= new Date(currentDate.setMonth(currentDate.getMonth() - 3))
                    );
                    break;
                case "Last year":
                    filtered = filtered.filter(
                        (movement) => new Date(movement.createdAt) >= new Date(currentDate.setFullYear(currentDate.getFullYear() - 1))
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

    // Open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Card className="p-6 bg-gray-800 text-white rounded-none">
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
                        <Spinner className="h-5 w-5" color="blue" />
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
                    <Button onClick={handleApplyDateFilter}>Apply</Button>
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

                    {selectedProduct && selectedProduct.picture && (
                        <div className="ml-6 w-1/4 flex justify-center items-center">
                            <img
                                src={`http://localhost:3000/${selectedProduct.picture}`}
                                alt={selectedProduct.name}
                                className="w-40 h-40 object-contain rounded-lg cursor-pointer"
                                onClick={openModal}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for larger image */}
            <Dialog open={isModalOpen} onClose={closeModal} className="p-6 bg-gray-800 text-white rounded-md flex flex-col">
                <img
                    src={`http://localhost:3000/${selectedProduct?.picture}`}
                    alt={selectedProduct?.name}
                    className="max-w-full max-h-full"
                />
                <Button className="mt-4" onClick={closeModal}>Close</Button>
            </Dialog>

            <div className="mt-6">
                <Line data={chartData} options={chartOptions} />
            </div>
        </Card>
    );
};

export default ProductsDetails;