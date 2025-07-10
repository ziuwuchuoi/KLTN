import { NavLink, useNavigate } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "../utils/general.utils";
import { TbChartArea, TbFile, TbFileCertificate, TbLogout, TbUser, TbUsersGroup } from "react-icons/tb";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserRole } from "@/types/types";

const menuItems: {
    title: string;
    path: string;
    icon: React.ReactNode;
    permissionAllowed: UserRole;
}[] = [
    // {
    //     title: "Analysis",
    //     path: "/dashboard/analysis",
    //     icon: <TbChartArea className="h-5 w-5" />,
    //     permissionAllowed: "admin",
    // },
    {
        title: "Candidates",
        path: "/dashboard/candidates",
        icon: <TbUser className="h-5 w-5" />,
        permissionAllowed: "admin",
    },
    {
        title: "Recruiters",
        path: "/dashboard/recruiters",
        icon: <TbUsersGroup className="h-5 w-5" />,
        permissionAllowed: "admin",
    },
    {
        title: "Applications",
        path: "/dashboard/applications",
        icon: <TbFile className="h-5 w-5" />,
        permissionAllowed: "recruiter",
    },
    {
        title: "Job Descriptions",
        path: "/dashboard/jobdescriptions",
        icon: <TbFileCertificate className="h-5 w-5" />,
        permissionAllowed: "recruiter",
    },
    {
        title: "Test Sets",
        path: "/dashboard/testsets",
        icon: <TbFileCertificate className="h-5 w-5" />,
        permissionAllowed: "recruiter",
    },
];

const CustomSideBar = () => {
    const { user, logout, token, role } = useAuthStore();
    const navigate = useNavigate();

    // if the item allow more than 2 roles, then change this logic
    const filteredMenuItems = menuItems.filter((item) => role === item.permissionAllowed);

    const handleLogout = async () => {
        try {
            logout();
            localStorage.removeItem("accessToken");
            navigate(`/signin/${role}`);
        } catch (error) {
            console.error("Failed", error);
        }
    };

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <TbUsersGroup className="h-6 w-6 text-white" />
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </div>
                <div className="mt-1 flex lg:hidden">
                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="p-4 space-y-5">
                    {filteredMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                                            isActive ? "bg-green-400 text-primary-foreground" : "hover:bg-accent"
                                        )
                                    }
                                >
                                    {item.icon}
                                    <div>{item.title}</div>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-gray-800">
                <SidebarMenu className="space-y-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                                        isActive ? "bg-green-400 text-primary-foreground" : "hover:bg-accent"
                                    )
                                }
                            >
                                <TbUser className="h-5 w-5" />
                                <div>Profile</div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-red-600/20 text-red-400 hover:text-red-300 w-full text-left"
                            >
                                <TbLogout className="h-5 w-5" />
                                <div>Logout</div>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default CustomSideBar;
