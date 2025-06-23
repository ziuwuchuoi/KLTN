import CustomSideBar from "@/components/molecules/CustomSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Outlet } from "react-router-dom";

const PageDashboard = () => {
    const { token } = useAuthStore();
    
    return (
        <SidebarProvider className="w-full">
            <div className="w-full flex flex-row min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                <CustomSideBar />
                <div className="w-full flex-1 p-6">
                    <Outlet />
                </div>
            </div>
        </SidebarProvider>
    );
};

export default PageDashboard;
