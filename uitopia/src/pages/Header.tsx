import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "@/components/lib/general.utils"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

const navItems = [
    { title: "Accommodations", href: "/accommodations" },
    { title: "Transports", href: "/transports" },
    { title: "Tours & Activities", href: "/tours" },
]

export function Header() {
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const headerStyles = cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )

    const linkStyles = cn(
        "text-lg font-medium hover:text-primary transition-colors",
        isScrolled ? "text-gray-700" : "text-white"
    )

    const signInStyles = cn(
        "px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium",
        isScrolled
            ? "text-gray-700 hover:bg-gray-100"
            : "text-white hover:bg-white/10"
    )

    const signUpStyles = cn(
        "px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium",
        isScrolled
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-white text-gray-900 hover:bg-white/90"
    )

    return (
        <header className={headerStyles}>
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                    <Link to="/" className="font-bold text-2xl tracking-tight">
                        Wanderlust
                    </Link>

                    <NavigationMenu>
                        <NavigationMenuList className="gap-8">
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    <Link to={item.href} className={linkStyles}>
                                        {item.title}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/signin')}
                            className={signInStyles}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className={signUpStyles}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

