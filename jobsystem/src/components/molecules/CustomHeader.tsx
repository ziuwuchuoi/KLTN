import { TbGhost } from "react-icons/tb";
import { CustomNavigationMenu } from "./CustomNavigationMenu";

export default function CustomHeader() {
    return (
        <header className="fixed top-0 left-0 w-full bg-transparent z-50 flex items-center px-6 py-4">
            {/* Left - Logo */}
            <div className="flex items-center space-x-2">
                <TbGhost className="size-6 lg:size-8 xl:size-10 animate-spin text-white dark:text-white" />
            </div>

            {/* Middle - Website Name (Absolute Center) */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white">Smart CV</h1>

            {/* Right - Navigation Menu */}
            <div className="ml-auto mr-5 hidden md:flex space-x-6 text-white">
                <CustomNavigationMenu />
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden ml-auto">
                <button className="text-white text-2xl">☰</button>
            </div>
        </header>
    );
}
