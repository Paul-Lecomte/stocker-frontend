import React, { useEffect, useState } from 'react';
import { Button, Typography, Card } from "@material-tailwind/react";
import './ErrorPage.css'; // Add the CSS file for the animation

const ErrorPage = () => {
    const [showAnimation, setShowAnimation] = useState(false);

    // Trigger function for the Rick Roll link
    const trigger = () => {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    };

    // Detecting the key combination (Ctrl + Alt + D)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === "d") { // Trigger on Ctrl + Alt + D
                setShowAnimation(true);
                setTimeout(() => setShowAnimation(false), 5000); // Hide animation after 5 seconds
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: "#101923" }}>
            <Card className="p-8 text-center shadow-lg" style={{ background: "#212D3B", color: "#FFFFFF" }}>
                <Typography variant="h1" color="red" className="text-6xl font-bold mb-4">
                    404
                </Typography>
                <Typography variant="h5" className="mb-6">
                    Oops! Page not found.
                </Typography>
                <Typography variant="lead" className="mb-6">
                    The page you’re looking for doesn’t exist or has been moved.
                </Typography>
                <Button color="light-blue" onClick={() => window.location.href = "/"}>
                    Go to Home
                </Button>
                <Button onClick={trigger} color="light-blue" className="mt-4">
                    ?????
                </Button>
            </Card>

            {/* Display animation if triggered */}
            {showAnimation && (
                <div className="secret-animation">
                    <img src="/mmh.png" alt="Surprise" />
                </div>
            )}
        </div>
    );
};

export default ErrorPage;