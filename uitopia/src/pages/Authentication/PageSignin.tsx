import React, { useEffect, useState } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const PageSignin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/users/auth-google/login"; // Adjust the backend URL
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch("http://localhost:3000/users/status", { credentials: "include" });
                const data = await response.json();
                if (data.authenticated) {
                    console.log("User authenticated", data.user);
                    navigate("/"); 
                }
            } catch (error) {
                console.error("Error checking auth status", error);
            }
        };
        checkAuthStatus();
    }, [navigate]);

    return (
        <div className="flex flex-col w-full h-full items-center justify-center p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center">Log in</h2>
                <p className="text-muted-foreground text-center mt-2">
                    Enter your email and password to access your account.
                </p>

                <div className="mt-6">
                    <Label>Email</Label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <Label>Password</Label>
                    <Input
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="mt-2"
                    />
                </div>

                <LoadingButton
                    variant="default"
                    className="w-full mt-6"
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={() => {}}
                >
                    Log in
                </LoadingButton>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-3 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle className="text-lg" /> Sign in with Google
                </Button>
            </div>
        </div>
    );
};

export default PageSignin;
