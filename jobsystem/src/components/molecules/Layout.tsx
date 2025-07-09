import { Outlet } from "react-router-dom";
import CustomHeader from "./CustomHeader";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
            <CustomHeader />

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
