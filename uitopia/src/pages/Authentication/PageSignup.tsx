import React, { useEffect, useState } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const PageSignup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-col w-full max-w-[500px] px-8">
                <Label className="text-xl font-semibold tracking-tight">Creat an account</Label>
                <div className="text-muted-foreground pt-2">
                    Enter your name, email and password below to create an account
                </div>
                <Label className="pt-6">Name</Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="mt-2"
                    onKeyDown={(e) => e.key === "Enter"}
                />
                <Label className="pt-4">Email</Label>
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
                    onClick={() => {}}
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    Create account
                </LoadingButton>
                <div className="flex items-center justify-center pt-4">
                    <span className="text-muted-foreground">Already have an account?</span>
                    <Button variant="link" className="px-1" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                </div>
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
                <div className="text-center text-muted-foreground pt-6">
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

export default PageSignup;