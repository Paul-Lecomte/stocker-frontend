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
            const response = await axios.get('http://localhost:3000/api/furniture', {
                method : 'get',
                withCredentials : true
            });
            set(() => ({ furnitureList: response.data, furnitureLoading: false, success: true }));
        } catch (error) {
            set({ error: error.message, furnitureLoading: false });
        }
    },

    fetchDashboardData: async () => {
        set({ furnitureLoading: true, error: null });

        try {
            const productCountResponse = await axios.get('http://localhost:3000/api/furniture/count', {
                method : 'get',
                withCredentials : true
            });
            const movementCountResponse = await axios.get('http://localhost:3000/api/furniture/today-movements', {
                method : 'get',
                withCredentials : true
            });
            const mostSoldResponse = await axios.get('http://localhost:3000/api/furniture/most-sold', {
                method : 'get',
                withCredentials : true
            });
            const highestPriceResponse = await axios.get('http://localhost:3000/api/furniture/highest-price', {
                method : 'get',
                withCredentials : true
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
            const response = await axios.post('http://localhost:3000/api/furniture', data, {
                method : 'get',
                withCredentials : true
            });
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
            const response = await axios.put(`http://localhost:3000/api/furniture/${id}`, data, {
                method : 'get',
                withCredentials : true
            });
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
            await axios.delete(`http://localhost:3000/api/furniture/${id}`, {
                method : 'get',
                withCredentials : true
            });
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
