import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { cn } from "@/components/utils/general.utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/stores/useAuthStore";

const features = [
    {
        title: "CV Evaluation",
        description: "Get instant feedback on your CV with AI-powered analysis.",
        icon: (
            <svg className="h-12 w-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        href: "/cv-evaluation",
    },
    {
        title: "AI Interview Simulation (Coming Soon)",
        description: "Practice real-world interview scenarios with AI-generated questions.",
        icon: (
            <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
            </svg>
        ),
        href: "/ai-interview",
    },
    {
        title: "Quiz",
        description: "Test and expand your knowledge with AI-generated quizzes designed to challenge your understanding.",
        icon: (
            <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
        ),
        href: "/quiz",
    },
    {
        title: "Live Coding Test",
        description: "Write, run, and debug code in real-time coding environments.",
        icon: (
            <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 18l6-6m0 0l-6-6m6 6H2" />
            </svg>
        ),
        href: "/live-coding",
    },
];

const userMenu = [
    {
        title: "Profile",
        icon: (
            <svg className="h-12 w-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        href: "/profile",
    },
    {
        title: "Settings",
        icon: (
            <svg className="h-12 w-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        href: "/setting",
    },
    {
        title: "Sign Out",
        icon: (
            <svg className="h-12 w-12 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
];

export function CustomNavigationMenu() {
    const { user, logout, token } = useAuthStore();
    console.log("token", token)
    console.log("user", user)
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            logout();
            localStorage.removeItem("accessToken");
            navigate("/signin/candidate");
        } catch (error) {
            console.error("Failed", error);
        }
    };

    return (
        <div className="flex justify-between w-full">
            {/* Features Menu */}
            <NavigationMenu>
                <NavigationMenuList>
                    {/* Features Dropdown */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                        <NavigationMenuContent className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                            <ul className="grid w-[200px] gap-2 p-2 md:w-[300px] md:grid-cols-1 lg:w-[400px] ">
                                {features.map((feature) => (
                                    <ListItem
                                        key={feature.title}
                                        title={feature.title}
                                        href={feature.href}
                                        className="h-[80px]"
                                    >
                                        {feature.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Pricing, Contact, Sign In */}
                    <NavigationMenuItem>
                        <Link to="/pricing" className={navigationMenuTriggerStyle()}>
                            Pricing
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/contact" className={navigationMenuTriggerStyle()}>
                            Contact
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* User Menu - Separate Navigation Menu */}
            <NavigationMenu>
                <NavigationMenuList>
                    {user ? (
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>{user.name || "Account"}</NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                                <ul className="grid w-[50px] gap-2 p-2 md:w-[50px] lg:w-[150px] ">
                                    {userMenu.map((menuItem) => (
                                        <ListItem
                                            key={menuItem.title}
                                            title={menuItem.title}
                                            href={menuItem.href}
                                            onClick={menuItem.title === "Sign Out" ? handleLogout : undefined}
                                            className="h-[40px]"
                                        >
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem>
                            <Link to="/signin" className={navigationMenuTriggerStyle()}>
                                Sign In
                            </Link>
                        </NavigationMenuItem>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";
