import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup,
    SelectSeparator,
} from "@/components/ui/select";
import React, { ReactNode } from "react";
import { cn } from "@/components/general.utils";

export interface SortOption {
    id: string;
    label: string;
    group?: string;
}

interface CustomSelectProps<T extends { group?: string }> {
    // <T> makes this a generic type that can be used to define the type of the selected value
    options: T[]; // Array of items to be displayed as options in the select dropdown
    selectedValue: T; // The currently selected value from the options
    onChange: (value: T) => void; // Function to update the selected value (based on the getOptionValue function)
    customRenderItem: (item: T) => ReactNode; // Function to define how each option is rendered
    onChangeValue: (item: T) => string; // Function will return specific value for each option when onChange
    displayValue: (item: T) => ReactNode;
    children?: ReactNode; // Optional custom content for the select trigger
    className?: string;
    itemClassName?: string;
    emptyMessage?: string;
}

const organizeOptions = <T extends { group?: string }>(options: T[]) => {
    return [...options]
        .sort((a, b) => Number(!!b.group) - Number(!!a.group))
        .reduce(
            (acc, curr) => {
                const group = curr.group || "ungrouped";
                return {
                    ...acc,
                    [group]: [...(acc[group] || []), curr],
                };
            },
            {} as Record<string, T[]>
        );
};

const CustomSelect = <T extends { group?: string }>({
    options,
    selectedValue,
    onChange,
    customRenderItem,
    onChangeValue,
    displayValue,
    children,
    className,
    itemClassName,
    emptyMessage = "No items found",
}: CustomSelectProps<T>) => {
    const groupedOptions = organizeOptions(options);
    const groupEntries = Object.entries(groupedOptions);
    const groupedItems = groupEntries.filter(([group]) => group !== "ungrouped");
    const ungroupedItems = groupedOptions["ungrouped"] || [];

    return (
        <Select
            value={onChangeValue(selectedValue)} // Select expects a string value for each option
            onValueChange={(value) => onChange(options.find((item) => onChangeValue(item) === value) as T)}
        >
            <SelectTrigger className={(cn("w-full"), className)} showCaret={true}>
                {children || <SelectValue>{displayValue(selectedValue)}</SelectValue>}
            </SelectTrigger>
            <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                {options && options.length > 0 ? (
                    <>
                        {groupedItems.map(([groupName, items], index) => (
                            <React.Fragment key={groupName}>
                                <SelectGroup>
                                    <SelectLabel className="px-2 py-2 text-[11px] font-medium text-muted-foreground">
                                        {groupName}
                                    </SelectLabel>
                                    {items.map((item, idx) => (
                                        <SelectItem
                                            key={`${groupName}-${idx}`}
                                            value={onChangeValue(item)}
                                            className={cn("cursor-pointer", itemClassName)}
                                        >
                                            {customRenderItem(item)}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                                {(index < groupedItems.length - 1 || ungroupedItems.length > 0) && <SelectSeparator />}
                            </React.Fragment>
                        ))}

                        {ungroupedItems.map((item, index) => (
                            <SelectItem
                                key={`ungrouped-${index}`}
                                value={onChangeValue(item)}
                                className={cn("cursor-pointer", itemClassName)}
                            >
                                {customRenderItem(item)}
                            </SelectItem>
                        ))}
                    </>
                ) : (
                    <div className="cursor-not-allowed w-[300px] p-2 items-center justify-center text-sm">
                        {emptyMessage}
                    </div>
                )}
            </SelectContent>
        </Select>
    );
};

export default CustomSelect;
