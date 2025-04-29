import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { loginService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSearchParams } from "react-router-dom";

const PageSignin = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const { login, googleLogin, setToken } = useAuthStore();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const validRoles = ["candidate", "admin", "recruiter"];

    if (!validRoles.includes(role)) {
        return <div className="text-center text-red-500 pt-10">Invalid role!</div>;
    }

    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            await login({
                role,
                step: "request",
                type: 1,
                data: { email },
            });
            toast.success("OTP sent to your email.");
            setStep(2); // move to OTP verification UI
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
            navigate("/"); // or wherever you want
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
        } catch {
            toast.error("Google login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <div className="text-xl font-bold text-center capitalize">Sign in as {role}</div>

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
                            <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter the OTP" />
                        </div>
                    )}

                    <LoadingButton
                        className="w-full mt-2"
                        isLoading={isLoading}
                        onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
                    >
                        {step === 1 ? "Send OTP" : "Verify & Sign in"}
                    </LoadingButton>
                </div>

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
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle className="text-lg" /> Sign in with Google
                </Button>

                {/* {role === "candidate" && (
                    <div className="text-center text-sm text-muted-foreground pt-6">
                        Don’t have an account?
                        <Button variant="link" className="px-1" onClick={() => navigate("/signup")}>
                            Create one
                        </Button>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default PageSignin;
