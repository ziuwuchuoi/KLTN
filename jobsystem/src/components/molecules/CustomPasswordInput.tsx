"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface CustomPasswordInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export function CustomPasswordInput({
    value = "",
    onChange,
    placeholder = "Enter your password",
    label = "Password",
    disabled = false,
    required = false,
    className = "",
}: CustomPasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className={className}>
            <Label>{label}</Label>
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="pr-10"
                    disabled={disabled}
                    required={required}
                />
                <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    disabled={disabled}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
}
