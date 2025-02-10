import React, { useEffect, useState, useRef } from 'react';
import { useUserStore } from '../../stores/userStore.js';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import {Input, Button, Typography, Spinner} from "@material-tailwind/react";
import logo from "../../assets/stocker_name.svg";
import './style.css';
import {useFurnitureStore} from "../../stores/furnitureStore.js";

const hackingMessages = [
    "Initializing breach protocol...",
    "Bypassing firewall...",
    "Decrypting admin credentials...",
    "Extracting user database...",
    "ACCESS GRANTED.",
    "lol you don't even know your password noob"
];

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [hacking, setHacking] = useState(false);
    const [hackingText, setHackingText] = useState([]);
    const [error, setError] = useState("");
    const buttonRef = useRef(null);
    const { user, error: storeError, userLoading, login, success } = useUserStore();
    const { setCredentials } = useAuthStore();
    const navigate = useNavigate();
    const { furnitureLoading } = useFurnitureStore();

    useEffect(() => {
        if (success) {
            setCredentials({ user });
            navigate('/');
        }
    }, [navigate, success, user]);

    useEffect(() => {
        if (attempts >= 3) {
            setHacking(true);
            setHackingText([]);
            let index = 0;
            const interval = setInterval(() => {
                setHackingText(prev => [...prev, hackingMessages[index]]);
                index++;
                if (index >= hackingMessages.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setHacking(false);
                        setAttempts(0); // Reset attempts after hacking
                        setHackingText([]); // Clear hacking messages when reset
                    }, 3000);
                }
            }, 1000);
        }
    }, [attempts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear any existing error before making a new attempt
        try {
            const response = await login({ email, password });
            // Check for 401 Unauthorized response
            if (response.status === 401) {
                setError("Login failed. Incorrect email or password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
        setAttempts(prev => prev + 1);
    };

    useEffect(() => {
        if (attempts >= 4) {
            const button = buttonRef.current;
            if (button) {
                let rotation = 0;
                let offsetX = 0;
                let offsetY = 0;

                const moveButton = (event) => {
                    rotation += 20;
                    offsetX = (Math.random() - 0.5) * 100;
                    offsetY = (Math.random() - 0.5) * 50;

                    button.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
                };

                button.addEventListener("mouseenter", moveButton);

                return () => {
                    button.removeEventListener("mouseenter", moveButton);
                };
            }
        }
    }, [attempts]);

    if (furnitureLoading)
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner className="h-12 w-12"/>
            </div>
        );

    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-white" style={{ background: "#101923" }}>
            <div>
                <img src={logo} alt="logo" className="w-50 pb-4" />
            </div>
            <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-lg w-full max-w-sm text-white bg-gray-800">
                <Typography variant="h4" className="mb-6 text-center text-white">Login</Typography>

                <div className="mb-4">
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required color="white" size="lg" autoComplete="email" className="text-white" />
                </div>

                <div className="mb-4">
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required color="white" size="lg" autoComplete="current-password" className="text-white" />
                </div>

                {error && !hacking && (
                    <Typography color="red" className="mb-4 text-sm text-center text-white">{error}</Typography>
                )}

                <Button type="submit" className="bg-gray-700" size="lg" fullWidth disabled={userLoading} ref={buttonRef}>
                    {userLoading ? "Loading..." : "Login"}
                </Button>
            </form>

            {hacking && (
                <div className={`hacking-modal ${hacking ? 'show' : ''}`}>
                    <div className="terminal-header">Terminal</div>
                    <div className="terminal-body">
                        {hackingText.map((text, index) => (
                            <p key={index} className="hacking-text">{text}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;