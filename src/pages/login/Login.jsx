import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore.js';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { Input, Button, Typography } from "@material-tailwind/react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, error, userLoading, login, success } = useUserStore();
    const { setCredentials, userInfo } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            setCredentials({ user });
            navigate('/');
        }
    }, [navigate, success, setCredentials, user]);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
                    Login
                </Typography>

                <div className="mb-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        color="blue"
                        size="lg"
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        color="blue"
                        size="lg"
                    />
                </div>

                {error && (
                    <Typography color="red" className="mb-4 text-sm text-center">
                        {error}
                    </Typography>
                )}

                <Button type="submit" color="blue" size="lg" fullWidth disabled={userLoading}>
                    {userLoading ? "Loading..." : "Login"}
                </Button>
            </form>
        </div>
    );
};

export default Login;
