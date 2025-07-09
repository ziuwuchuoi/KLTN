import { cn } from "../utils/general.utils";

interface CustomHeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    align?: "left" | "center" | "right";
    compact?: boolean;
    className?: string;
}

const CustomHeroSection = ({
    title = "Codivio",
    subtitle = "Studio",
    description,
    align = "center",
    compact = false,
    className,
}: CustomHeroSectionProps) => {
    const getFlexAlignment = (alignment: string) => {
        switch (alignment) {
            case "left":
                return "justify-start text-left";
            case "right":
                return "justify-end text-right";
            default:
                return "justify-center text-center";
        }
    };

    const getDescriptionAlignment = (alignment: string) => {
        switch (alignment) {
            case "left":
                return "mr-auto";
            case "right":
                return "ml-auto";
            default:
                return "mx-auto";
        }
    };

    const flexAlignment = getFlexAlignment(align);
    const descriptionAlignment = getDescriptionAlignment(align);

    return (
        <div className={cn("w-full", className)}>
            {/* Title Section */}
            <div className={cn("flex flex-col", flexAlignment)}>
                <h1
                    className={cn(
                        "font-bold leading-tight whitespace-nowrap",
                        compact ? "text-2xl md:text-3xl mb-2" : "text-4xl md:text-5xl lg:text-6xl mb-4"
                    )}
                >
                    <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">
                        {title}
                    </span>
                    {subtitle && (
                        <>
                            {" "}
                            <span className="text-white">{subtitle}</span>
                        </>
                    )}
                </h1>

                {/* Description Section */}
                {description && (
                    <div className={cn("max-w-2xl", descriptionAlignment)}>
                        <p
                            className={cn(
                                "text-gray-300 leading-relaxed italic",
                                compact ? "text-xs md:text-sm" : "text-base md:text-lg",
                                align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
                            )}
                        >
                            {description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomHeroSection;
