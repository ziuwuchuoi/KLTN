import React, { useState, useEffect } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";

const PageSignin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     *  @date 06/09/2024
     *  The authentication flow of the devmate can be described as follows:
     *  1. When user access the devmate from whatever path, the user will be redirected to the login page
     *  1*. This have an issue that not check auth at Login that why we have useEffect below
     *  2. Try to fetch the user data from backend by accessToken and refreshToken
     *  3. If the user is already authenticated, the user will be redirected to the original path
     *  4. If the user is not authenticated yet, they must login first before navigating to the original path
     */

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-col w-full max-w-[500px] px-8">
                <Label className="text-xl font-semibold tracking-tight">Log in</Label>
                <div className="text-muted-foreground pt-2">
                    Enter your email and password below to log in to your account
                </div>
                <Label className="pt-6">Email</Label>
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="mt-2"
                    onKeyDown={(e) => e.key === "Enter"}
                />
                <Label className="pt-4">Password</Label>
                <Input
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="mt-2"
                    onKeyDown={(e) => e.key === "Enter"}
                />
                <LoadingButton
                    variant="default"
                    className="w-full mt-4"
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={() => {}}
                >
                    Log in
                </LoadingButton>
                {/* <div className="flex items-center justify-center pt-4">
                    <span className="text-muted-foreground">Don't have an account?</span>
                    <Button variant="link" onClick={() => navigate("/signup")}>
                        Sign up
                    </Button>
                </div> */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs py-6">
                        <span className="bg-card-alt px-2 text-muted-foreground uppercase"> Or Continue with</span>
                    </div>
                </div>

                {/* <SSOHandler>
                    <Button variant="secondary" className="w-full">
                        Bosch SSO
                    </Button>
                </SSOHandler> */}

                <div className="text-center text-sm text-muted-foreground pt-6">
                    By continue, you agree to our{" "}
                    {/* <FormTermOfService>
                        <a className="underline underline-offset-4 hover:text-primary">Terms of Service</a>
                    </FormTermOfService>
                    <span className="mx-1">and</span>
                    <FormPrivacyPolicy>
                        {" "}
                        <a className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>
                    </FormPrivacyPolicy> */}
                </div>
            </div>
        </div>
    );
};

export default PageSignin;