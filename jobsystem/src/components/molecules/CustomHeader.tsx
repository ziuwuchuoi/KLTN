import { useEffect, useState } from "react";
import { CustomNavigationMenu } from "./CustomNavigationMenu";
import { useNavigate } from "react-router-dom";

export default function CustomHeader() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 flex items-center px-6 py-4 transition-colors duration-300 ${
                scrolled ? "bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900" : "bg-transparent"
            }`}
        >
            {/* Left - Logo */}
            <div className="flex items-center space-x-2">
                {/* <TbGhost className="size-6 lg:size-8 xl:size-10 animate-spin text-white dark:text-white" /> */}
            </div>

            {/* Middle - Website Name (Absolute Studio) */}
            <h1
                onClick={() => navigate("/")}
                className="cursor-pointer absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white"
            >
                Codivio
            </h1>

            {/* Right - Navigation Menu */}
            <div className="ml-auto mr-5 hidden md:flex space-x-6 text-white">
                <CustomNavigationMenu />
            </div>
        </header>
    );
}
