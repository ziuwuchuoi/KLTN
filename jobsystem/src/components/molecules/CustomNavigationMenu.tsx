"use client";

import * as React from "react";
import { Link } from "react-router-dom";

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
        title: "AI Interview Simulation",
        description: "Practice real-world interview scenarios with AI-generated questions.",
        icon: (
            <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
            </svg>
        ),
        href: "/ai-interview",
    },
    {
        title: "Technical Quiz",
        description: "Test your technical knowledge with AI-generated quizzes.",
        icon: (
            <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
        ),
        href: "/technical-quiz",
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

export function CustomNavigationMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {/* Features Dropdown */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] md:grid-cols-1 lg:w-[400px] ">
                            {features.map((feature) => (
                                <ListItem key={feature.title} title={feature.title} href={feature.href}>
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
                <NavigationMenuItem>
                    <Link to="/signin" className={navigationMenuTriggerStyle()}>
                        Sign In
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"