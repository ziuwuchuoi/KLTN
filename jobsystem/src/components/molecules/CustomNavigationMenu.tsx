import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/components/utils/general.utils";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/stores/useAuthStore";

const leftMenu = [
    { title: "Jobs", href: "/jobs" },
    { title: "CV Evaluation", href: "/cv-evaluation" },
    { title: "Quiz", href: "/quiz" },
    { title: "Code", href: "/live-coding" },
];

export function CustomNavigationMenu() {
    const { user, logout, token } = useAuthStore();
    console.log("User in CustomNavigationMenu:", user, token);
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

    const userMenu = [
        { title: "Profile", href: "/profile" },
        { title: "Settings", href: "/setting" },
        { title: "Sign Out", onClick: handleLogout },
    ];

    return (
        <div className="flex justify-between w-full">
            {/* Left: Top-level links */}
            <NavigationMenu>
                <NavigationMenuList>
                    {leftMenu.map(({ title, href }) => (
                        <NavigationMenuItem key={title}>
                            <Link to={href} className={navigationMenuTriggerStyle()}>
                                {title}
                            </Link>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Right: User menu */}
            <NavigationMenu>
                <NavigationMenuList>
                    {user ? (
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>{user.name || "Account"}</NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 text-white">
                                <ul className="grid gap-2 p-2 w-[150px]">
                                    {userMenu.map(({ title, href, onClick }) => (
                                        <li key={title}>
                                            <NavigationMenuLink asChild>
                                                <a
                                                    href={href}
                                                    onClick={(e) => {
                                                        if (onClick) {
                                                            e.preventDefault();
                                                            onClick();
                                                        }
                                                    }}
                                                    className="block select-none rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                                                >
                                                    {title}
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
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
