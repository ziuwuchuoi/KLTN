"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { Info } from "lucide-react";
import { CustomPasswordInput } from "@/components/molecules/CustomPasswordInput";

const PageSignin = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const { login, googleLogin, loginAdmin } = useAuthStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get("redirect");

    const isOAuthCallback = window.location.search.includes("login_oauth2=true");

    useEffect(() => {
        if (redirectUrl && !isOAuthCallback) {
            const decodedUrl = decodeURIComponent(redirectUrl);

            const existingRedirectUrl = localStorage.getItem("auth_redirect_url");

            if (!existingRedirectUrl || existingRedirectUrl === "/" || decodedUrl !== "/") {
                localStorage.setItem("auth_redirect_url", decodedUrl);
            } else {
                console.log("Preserved existing redirect URL:", existingRedirectUrl);
            }

            const savedUrl = localStorage.getItem("auth_redirect_url");
        } else if (isOAuthCallback) {
            console.log("OAuth callback detected - NOT overwriting localStorage");
        } else {
            console.log("No redirect URL found in search params");
        }
    }, [redirectUrl, isOAuthCallback]);

    const validRoles = ["candidate", "admin", "recruiter"];

    if (!validRoles.includes(role)) {
        return <div className="text-center text-red-500 pt-10">Invalid role!</div>;
    }

    const handleSuccessfulLogin = () => {
        const storedRedirectUrl = localStorage.getItem("auth_redirect_url");

        if (storedRedirectUrl && storedRedirectUrl !== "/") {
            localStorage.removeItem("auth_redirect_url");
            navigate(storedRedirectUrl);
        } else {
            if (role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        }
    };

    const handleAdminLogin = async () => {
        setIsLoading(true);
        try {
            await loginAdmin(name, password);
            toast.success("Admin login successful");
            handleSuccessfulLogin();
        } catch (err) {
            toast.error("Failed to login as admin.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = async () => {
        console.log("=== Send OTP ===");
        console.log("Email:", email);
        setIsLoading(true);
        try {
            await login({
                role,
                step: "request",
                type: 1,
                data: { email },
            });
            toast.success("OTP sent to your email.");
            setStep(2);
        } catch (err) {
            toast.error("Failed to send OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        try {
            await login({
                role,
                step: "verify",
                type: 1,
                data: { email, otp },
            });
            toast.success("Login successful!");
            handleSuccessfulLogin();
        } catch (err) {
            toast.error("Invalid or expired OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await googleLogin(role);
            console.log("Date now:", new Date());
        } catch (err) {
            toast.error("Google login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <div className="text-xl font-bold text-center capitalize">Sign in as {role}</div>

                {redirectUrl?.includes("testset") && role === "candidate" && !isOAuthCallback && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Assessment Access Required</p>
                            <p className="text-blue-600">Please sign in to continue with your assessment.</p>
                        </div>
                    </div>
                )}

                {role === "admin" ? (
                    <div className="mt-6 space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                                disabled={step === 2}
                            />
                        </div>

                        <CustomPasswordInput
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter your password"
                            label="Password"
                            disabled={isLoading}
                            required
                        />
                        <LoadingButton className="w-full mt-2" isLoading={isLoading} onClick={handleAdminLogin}>
                            Sign In
                        </LoadingButton>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={step === 2}
                            />
                        </div>

                        {step === 2 && (
                            <div>
                                <Label>OTP</Label>
                                <Input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter the OTP"
                                />
                            </div>
                        )}

                        <LoadingButton
                            className="w-full mt-2"
                            isLoading={isLoading}
                            onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
                        >
                            {step === 1 ? "Send OTP" : "Verify & Sign in"}
                        </LoadingButton>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-3 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-transparent"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <FcGoogle className="text-lg" /> Sign in with Google
                        </Button>

                        {role === "recruiter" && (
                            <div className="text-center text-sm text-muted-foreground pt-6">
                                Don't have an account?
                                <Button variant="link" className="px-1" onClick={() => navigate("/signup/recruiter")}>
                                    Create one
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageSignin;
