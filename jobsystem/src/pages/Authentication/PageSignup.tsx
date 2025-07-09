import { useState } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const PageSignup = () => {
    const { role } = useParams();
    const { isLoading, signupRecruiter } = useAuthStore();
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");

    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await signupRecruiter({
                email,
                position,
                companyName,
                companyWebsite,
            });
            navigate(`/signin/${role}`);
        } catch (error) {
            toast.error("Can not signup. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <div className="text-xl font-bold text-center capitalize">Sign up for {role}</div>

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
                    <Label>Position</Label>
                    <Input
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Enter your position"
                        className="mt-1"
                    />
                </div>

                <div className="mt-4">
                    <Label>Company Name</Label>
                    <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company's name"
                        className="mt-1"
                    />
                </div>

                <div className="mt-4">
                    <Label>Company Website</Label>
                    <Input
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        placeholder="Enter company's website"
                        className="mt-1"
                    />
                </div>

                <LoadingButton
                    variant="default"
                    className="w-full mt-6"
                    disabled={isLoading}
                    isLoading={isLoading}
                    onClick={handleSignup}
                >
                    Create account
                </LoadingButton>

                <div className="text-center text-sm text-muted-foreground pt-6">
                    Already have an account?
                    <Button variant="link" className="px-1" onClick={() => navigate("/signin/recruiter")}>
                        Sign in
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PageSignup;
