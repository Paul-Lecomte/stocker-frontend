import axios from 'axios';

const API_URL = '/api/stock-movements';

export const getStockMovements = async (furnitureId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(`${API_URL}/${furnitureId}/movements`, { params });
    return response.data; // Make sure this is an array
};