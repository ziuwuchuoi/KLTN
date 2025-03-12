import React, { useEffect, useState } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const PageSignup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignup = () => {
        window.location.href = "http://localhost:3000/users/auth-google/login"; // Adjust the backend URL
    };

    return (
        <div className="flex flex-col w-full h-full items-center justify-center p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <div className="text-xl font-bold text-center">Create an account</div>

                <div className="mt-4">
                    <Label>Name</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-1"
                    />
                </div>

                <div className="mt-4">
                    <Label>Email</Label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="mt-1"
                    />
                </div>

                <div className="mt-4">
                    <Label>Password</Label>
                    <Input
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="mt-1"
                    />
                </div>

                <LoadingButton
                    variant="default"
                    className="w-full mt-6"
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={() => {}}
                >
                    Create account
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
                    onClick={handleGoogleSignup}
                >
                    <FcGoogle className="text-lg" /> Sign up with Google
                </Button>

                <div className="text-center text-sm text-muted-foreground pt-6">
                    Already have an account?
                    <Button variant="link" className="px-1" onClick={() => navigate("/signin")}>
                        Sign in
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PageSignup;
