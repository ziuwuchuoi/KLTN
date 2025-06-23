import { NavLink } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "../utils/general.utils";
import { TbChartArea, TbFile, TbFileCertificate, TbUser, TbUsersGroup } from "react-icons/tb";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserRole } from "@/types/types";

const menuItems: {
    title: string;
    path: string;
    icon: React.ReactNode;
    permissionAllowed: UserRole;
}[] = [
    {
        title: "Analysis",
        path: "/dashboard/analysis",
        icon: <TbChartArea className="h-5 w-5" />,
        permissionAllowed: "admin",
    },
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
    const { token, user, admin } = useAuthStore();

    const userRoles = [...(user?.roles ?? []), admin?.role];

    const filteredMenuItems = menuItems.filter((item) => userRoles.includes(item.permissionAllowed));

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
        </Sidebar>
    );
};

export default CustomSideBar;
