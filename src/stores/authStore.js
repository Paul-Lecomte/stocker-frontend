import {create} from "zustand";
import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from "react";


export const useAuthStore = create((set) => ({
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,

    setCredentials: (data) => {
        set(() => ({userInfo: data}))
        localStorage.setItem('userInfo', JSON.stringify(data))
    },

    logout: () => {
        set(() => ({userInfo: null}))
        localStorage.removeItem('userInfo')
    }
}))

const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();  // This will give us the current path

    useEffect(() => {
        // Check if 'jwt' token exists in cookies
        const jwtToken = document.cookie.split(';').some((item) => item.trim().startsWith('jwt='));

        // If no token and not already on the login page, redirect to login
        if (!jwtToken && location.pathname !== '/login') {
            navigate('/login', { replace: true });  // 'replace: true' prevents adding the redirect to history
        }
    }, [navigate, location]);  // Depend on navigate and location
};

export default useAuth;