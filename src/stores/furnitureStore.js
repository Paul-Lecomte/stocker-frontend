import { create } from "zustand";
import axios from "axios";

export const useFurnitureStore = create((set) => ({
    furnitureList: [],
    furnitureLoading: false,
    error: null,
    success: false,
    productCount: 0,
    movementCount: 0,
    mostSoldProducts: [],
    highestPriceProducts: [],

    fetchFurniture: async () => {
        set({ furnitureLoading: true, error: null });
        try {
            const response = await axios.get('http://localhost:3000/api/furniture');
            set(() => ({ furnitureList: response.data, furnitureLoading: false, success: true }));
        } catch (error) {
            set({ error: error.message, furnitureLoading: false });
        }
    },

    fetchDashboardData: async () => {
        set({ furnitureLoading: true, error: null });
        const token = localStorage.getItem('userInfo');

        try {
            const productCountResponse = await axios.get('http://localhost:3000/api/furniture/count', {
                headers: {
                    Authorization: `Bearer ${token}` // Set the token in the headers
                }
            });
            const movementCountResponse = await axios.get('http://localhost:3000/api/furniture/today-movements', {
                headers: {
                    Authorization: `Bearer ${token}` // Set the token in the headers
                }
            });
            const mostSoldResponse = await axios.get('http://localhost:3000/api/furniture/most-sold', {
                headers: {
                    Authorization: `Bearer ${token}` // Set the token in the headers
                }
            });
            const highestPriceResponse = await axios.get('http://localhost:3000/api/furniture/highest-price', {
                headers: {
                    Authorization: `Bearer ${token}` // Set the token in the headers
                }
            });

            set({
                productCount: productCountResponse.data.count,
                movementCount: movementCountResponse.data.count,
                mostSoldProducts: mostSoldResponse.data,
                highestPriceProducts: highestPriceResponse.data,
                furnitureLoading: false,
                success: true,
            });
        } catch (error) {
            set({ error: error.message, furnitureLoading: false });
        }
    },


    addFurniture: async (data) => {
        set({ furnitureLoading: true, error: null });
        try {
            const response = await axios.post('http://localhost:3000/api/furniture', data);
            set((state) => ({
                furnitureList: [...state.furnitureList, response.data],
                furnitureLoading: false,
                success: true,
            }));
        } catch (error) {
            set({ error: error.message, furnitureLoading: false });
        }
    },

    updateFurniture: async (id, data) => {
        set({ furnitureLoading: true, error: null });
        try {
            const response = await axios.put(`http://localhost:3000/api/furniture/${id}`, data);
            set((state) => ({
                furnitureList: state.furnitureList.map((furniture) =>
                    furniture._id === id ? response.data : furniture
                ),
                furnitureLoading: false,
                success: true,
            }));
        } catch (error) {
            set({ error: error.message, furnitureLoading: false });
        }
    },

    deleteFurniture: async (id) => {
        set({ furnitureLoading: true, error: null });
        try {
            await axios.delete(`http://localhost:3000/api/furniture/${id}`);
            set((state) => ({
                furnitureList: state.furnitureList.filter((furniture) => furniture._id !== id),
                furnitureLoading: false,
                success: true,
            }));
        } catch (error) {
            set({ error: error.message, furnitureLoading: false });
        }
    },
}));
