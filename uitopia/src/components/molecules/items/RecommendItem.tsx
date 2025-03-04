import { TbBed, TbBeach, TbBuilding, TbMap, TbTrash, TbTicket } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { FormatDate, FormatPrice } from "@/components/general.utils";
import TooltipWrapper from "../helpers/TooltipWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/general.utils";

interface TourismItemProps {
    // Mandatory props
    onItemClick?: () => void;
    index: number;
    id: string;
    name: string;
    description: React.ReactNode;
    type: "accommodation" | "entertainment" | "dining" | "transportation" | "tour";
    // Optional props
    createdAt?: string;
    price?: number;
    rating?: number;
    location?: string;
    // Render Node
    topChildren?: React.ReactNode;
    bottomChildren?: React.ReactNode;
    // Show UI elements
    showDeleteButton?: boolean;
    isSelected?: boolean;
    disabled?: boolean;
    isFeatured?: boolean;
    // For deletion
    deleteConfirmText?: string;
    isDeleteWithConfirmText?: boolean;
    onRemove?: () => void;
    // Styling the container
    className?: string;
    descriptionContainerClassName?: string;
    showIndex?: boolean;
    // Avatar
    avatarUrl?: string;
    canEdit?: boolean;
}

const TourismItem = ({
    onItemClick,
    index,
    id,
    name,
    description,
    createdAt,
    type,
    price,
    rating,
    location,
    topChildren,
    bottomChildren,
    disabled,
    isSelected,
    showDeleteButton = false,
    isFeatured = false,
    deleteConfirmText,
    isDeleteWithConfirmText = false,
    onRemove,
    className,
    descriptionContainerClassName,
    showIndex = false,
    avatarUrl,
    canEdit = false,
}: TourismItemProps) => {
    // Map types to user-friendly display names
    const mapTypeToDisplayName = (type: string): string => {
        const typeMap: Record<string, string> = {
            accommodation: "Accommodation",
            entertainment: "Entertainment",
            dining: "Dining",
            transportation: "Transportation",
            tour: "Tour Package",
        };
        return typeMap[type] || type;
    };

    // Render stars for rating
    const renderRating = () => {
        if (!rating) return null;

        return (
            <div className="flex items-center space-x-1">
                <div className="text-yellow-500 text-xs">★</div>
                <div className="text-xs">{rating.toFixed(1)}</div>
            </div>
        );
    };

    return (
        <div
            key={id}
            className={cn(
                "flex flex-col w-full h-[160px] p-3 bg-muted/40 shadow-sm border border-border/50 rounded-lg hover:cursor-pointer group/item select-none",
                "transition-transform duration-300 ease-in-out",
                "hover:scale-[1.01] hover:ring-[1.5px] ring-muted-foreground/25",
                isSelected && "ring-2 ring-muted-foreground",
                className
            )}
            onClick={onItemClick}
        >
            <div className="flex flex-col h-full group/header">
                <div className="flex w-full items-center justify-between space-x-2">
                    {showIndex ? (
                        <div className="flex items-center justify-center left-1 top-1 rounded-lg w-7 h-7 bg-muted-foreground/10 text-xs font-semibold">
                            {index + 1}
                        </div>
                    ) : (
                        <div className="flex w-full items-center truncate z-0 ">
                            <Avatar className="flex size-10 rounded-lg">
                                {avatarUrl && <AvatarImage src={avatarUrl} />}
                                <AvatarFallback className="rounded-lg bg-transparent">
                                    {type === "accommodation" && (
                                        <div className="flex items-center justify-center p-2 w-full h-full bg-blue-500/10 text-blue-600">
                                            <TbBed className="size-6" />
                                        </div>
                                    )}
                                    {type === "entertainment" && (
                                        <div className="flex items-center justify-center p-2 w-full h-full bg-purple-500/10 text-purple-600">
                                            <TbTicket className="size-6" />
                                        </div>
                                    )}
                                    {type === "dining" && (
                                        <div className="flex items-center justify-center p-2 w-full h-full bg-red-500/10 text-red-600">
                                            <TbBuilding className="size-6" />
                                        </div>
                                    )}
                                    {type === "transportation" && (
                                        <div className="flex items-center justify-center p-2 w-full h-full bg-green-500/10 text-green-600">
                                            <TbMap className="size-6" />
                                        </div>
                                    )}
                                    {type === "tour" && (
                                        <div className="flex items-center justify-center p-2 w-full h-full bg-orange-500/10 text-orange-600">
                                            <TbBeach className="size-6" />
                                        </div>
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <TooltipWrapper
                                tooltipMessage={name.length > 32 ? name : ""}
                                className="truncate items-center"
                            >
                                <div className="truncate ml-3 leading-4">
                                    <div className="truncate items-center text-left text-sm font-medium">
                                        <div className="truncate flex items-center">
                                            {name}
                                            {isFeatured && (
                                                <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0">
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center space-x-2">
                                        <div className="text-[11px] text-muted-foreground/50 capitalize">
                                            {mapTypeToDisplayName(type)}
                                        </div>
                                        {location && (
                                            <div className="text-[11px] text-muted-foreground/50 truncate">
                                                • {location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TooltipWrapper>
                        </div>
                    )}
                    <div className="grow" />

                    <div
                        className="hidden group-hover/item:flex items-start h-full space-x-1"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        {topChildren}
                    </div>
                </div>
                <div className={cn("flex flex-col h-full p-1 text-sm mr-4", showIndex && "pt-3")}>
                    {showIndex && (
                        <TooltipWrapper tooltipMessage={name.length > 32 ? name : ""}>
                            <div className="font-medium truncate">{name}</div>
                        </TooltipWrapper>
                    )}

                    <TooltipWrapper tooltipMessage={description} tooltipContainerClassName="max-w-xl z-[9999]">
                        <div
                            className={cn(
                                "text-left text-xs text-muted-foreground line-clamp-3",
                                showIndex ? "mt-0" : "mt-3",
                                descriptionContainerClassName
                            )}
                        >
                            {description}
                        </div>
                    </TooltipWrapper>
                </div>
            </div>

            <div className="flex mt-auto w-full items-center justify-between">
                <div className="flex items-center space-x-3">
                    {createdAt && (
                        <div className="flex h-[20px] items-center text-xs text-muted-foreground/50">
                            {FormatDate(createdAt, "simple")}
                        </div>
                    )}
                    {renderRating()}
                </div>
                <div className="flex items-center space-x-2">
                    {price !== undefined && <div className="text-sm font-medium">{FormatPrice(price)}</div>}
                    {bottomChildren}
                </div>
            </div>
        </div>
    );
};

export default TourismItem;
