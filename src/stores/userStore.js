import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set) => ({
    users: [],
    user: null,
    userLoading: false,
    error: null,
    success: false,
    message: null,

    // Register a new user
    register: async (data) => {
        set({ userLoading: true, error: null });
        try {
            const response = await axios.post('http://localhost:3000/api/user/register', data, {
                method : 'post',
                withCredentials : true
            });
            set(() => ({ user: response.data, userLoading: false, success: true }));
        } catch (error) {
            set({ error: error.message, userLoading: false });
        }
    },

    // Login user
    login: async (data) => {
        set({ userLoading: true, error: null });
        try {
            const response = await axios.post('http://localhost:3000/api/user/login', data, {
                method : 'post',
                withCredentials: true
            });
            set(() => ({ user: response.data, userLoading: false, success: true }));
        } catch (error) {
            set({ error: error.message, userLoading: false });
        }
    },

    // Logout user
    userLogout: async () => {
        set({ userLoading: true, error: null });
        try {
            const response = await axios.post('http://localhost:3000/api/user/logout');
            set(() => ({ message: response.data, userLoading: false, user: null }));
        } catch (error) {
            set({ error: error.message, userLoading: false });
        }
    },

    // Fetch all users
    fetchUsers: async () => {
        set({ userLoading: true, error: null });
        try {
            const response = await axios.get('http://localhost:3000/api/user', {
                method : 'get',
                withCredentials : true
            });
            set(() => ({ users: response.data, userLoading: false, success: true }));
        } catch (error) {
            set({ error: error.message, userLoading: false });
        }
    },

    // Update a specific user
    updateUser: async (id, data) => {
        set({ userLoading: true, error: null });
        try {
            const response = await axios.put(`http://localhost:3000/api/user/${id}`, data, {
                method : 'put',
                withCredentials : true
            });
            set((state) => ({
                users: state.users.map((user) => (user._id === id ? response.data : user)),
                userLoading: false,
                success: true,
            }));
        } catch (error) {
            set({ error: error.message, userLoading: false });
        }
    },

    // Delete a specific user
    deleteUser: async (id) => {
        set({ userLoading: true, error: null });
        try {
            await axios.delete(`http://localhost:3000/api/user/${id}`, {
                method : 'delete',
                withCredentials : true
            });
            set((state) => ({
                users: state.users.filter((user) => user._id !== id),
                userLoading: false,
                success: true,
            }));
        } catch (error) {
            set({ error: error.message, userLoading: false });
        }
    },
}));
