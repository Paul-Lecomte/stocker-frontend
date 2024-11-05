import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore.js';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { Input, Button, Typography } from "@material-tailwind/react";
import logo from "../../assets/stocker_name.svg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { user, error, userLoading, login, success } = useUserStore();
    const { setCredentials, userInfo } = useAuthStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            setCredentials({user});
            navigate('/');
        }
    }, [navigate, success, user]);

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
        <div className="flex flex-col justify-center items-center min-h-screen" style={{background: "#101923"}}>
            <div>
                <img
                    src={logo}
                    alt="logo"
                    className="w-50 pb-4"
                />
            </div>
            <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-lg w-full max-w-sm"
                  style={{background: "#212D3B", color: "#FFFFFF"}}>
                <Typography variant="h4" className="mb-6 text-center">
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
                        autoComplete="email"
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
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <Typography color="red" className="mb-4 text-sm text-center">
                        {error}
                    </Typography>
                )}

                <Button type="submit" style={{background: "#101923"}} size="lg" fullWidth disabled={userLoading}>
                    {userLoading ? "Loading..." : "Login"}
                </Button>
            </form>
        </div>
    );
};

export default Login;
