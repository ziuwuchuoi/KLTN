import { ChartBar, Users, User, Briefcase, FileText } from "lucide-react";
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
import { useState } from "react";
import { TbUser, TbUsersGroup } from "react-icons/tb";
import { useAuthStore } from "@/stores/useAuthStore";

const menuItems = [
    {
        title: "Analysis",
        path: "/dashboard/analysis",
        icon: ChartBar,
    },
    {
        title: "Candidates",
        path: "/dashboard/candidates",
        icon: User,
    },
    {
        title: "Recruiters",
        path: "/dashboard/recruiters",
        icon: Briefcase,
    },
];

const CustomSideBar = () => {
    const { token } = useAuthStore();
    console.log("token", token);

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <TbUsersGroup className="h-6 w-6 text-white" />
                    <h1 className="text-xl font-bold">Admin</h1>
                </div>
                <div className="mt-1 flex lg:hidden">
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="p-4 space-y-5">
                    {menuItems.map((item) => (
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
                                    <item.icon className="h-5 w-5" />
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
