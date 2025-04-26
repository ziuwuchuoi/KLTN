import React, { useState } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const PageSigninAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <div className="text-xl font-bold text-center">Access Your Account</div>

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
                    Sign in
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

                <div className="text-center text-sm text-muted-foreground pt-6">
                    Don't have an account?
                    <Button variant="link" className="px-1" onClick={() => navigate("/signup")}>
                        Create a new account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PageSigninAdmin;
