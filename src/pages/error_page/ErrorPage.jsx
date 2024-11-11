import React from 'react';
import { Button, Typography, Card } from "@material-tailwind/react";

const ErrorPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen" style={{background: "#101923"}}>
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
            </Card>
        </div>
    );
};

export default ErrorPage;
