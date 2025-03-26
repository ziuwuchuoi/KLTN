"use client";

import React, { type FC, useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { DateInput } from "./date-input";
import { cn } from "@/components/utils/general.utils";
import { FormatDate } from "@/components/general.utils";

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange }) => void;
    /** Initial value for start date */
    initialDateFrom?: Date | string;
    /** Initial value for end date */
    initialDateTo?: Date | string;
    /** Alignment of popover */
    align?: "start" | "center" | "end";
    /** Option for locale */
    locale?: string;
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === "string") {
        // Split the date string to get year, month, and day parts
        const parts = dateInput.split("-").map((part) => parseInt(part, 10));
        // Create a new Date object using the local timezone
        // Note: Month is 0-indexed, so subtract 1 from the month part
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date;
    } else {
        // If dateInput is already a Date object, return it directly
        return dateInput;
    }
};

interface DateRange {
    from: Date;
    to: Date | undefined;
}

interface Preset {
    name: string;
    label: string;
}

// Define presets (updated)
const PRESETS: Preset[] = [
    { name: "7days", label: "7 days" },
    { name: "14days", label: "14 days" },
    { name: "30days", label: "30 days" },
];

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string;
} = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    onUpdate,
    align = "center", // Change alignment to bottom
    locale = "vi-VN", // Set locale to Vietnamese
}): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);

    const [range, setRange] = useState<DateRange>({
        from: getDateAdjustedForTimezone(initialDateFrom),
        to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : getDateAdjustedForTimezone(initialDateFrom),
    });

    // Refs to store the values of range when the date picker is opened
    const openedRangeRef = useRef<DateRange | undefined>();
    const popoverRef = useRef<HTMLDivElement>(null);

    const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);

    const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== "undefined" ? window.innerWidth < 960 : false);

    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 960);
        };

        window.addEventListener("resize", handleResize);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getPresetRange = (presetName: string, fromDate: Date): DateRange => {
        const preset = PRESETS.find(({ name }) => name === presetName);
        if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
        let to: Date | undefined = undefined;

        switch (preset.name) {
            case "7days":
                to = new Date(fromDate);
                to.setDate(fromDate.getDate() + 6);
                break;
            case "14days":
                to = new Date(fromDate);
                to.setDate(fromDate.getDate() + 13);
                break;
            case "30days":
                to = new Date(fromDate);
                to.setDate(fromDate.getDate() + 29);
                break;
        }

        return { from: fromDate, to };
    };

    const setPreset = (preset: string): void => {
        const presetRange = getPresetRange(preset, range.from);
        setRange(presetRange);
    };

    const checkPreset = (): void => {
        for (const preset of PRESETS) {
            const presetRange = getPresetRange(preset.name, range.from);

            const normalizedRangeFrom = new Date(range.from);
            normalizedRangeFrom.setHours(0, 0, 0, 0);
            const normalizedPresetFrom = new Date(presetRange.from.setHours(0, 0, 0, 0));

            const normalizedRangeTo = new Date(range.to ?? 0);
            normalizedRangeTo.setHours(0, 0, 0, 0);
            const normalizedPresetTo = new Date(presetRange.to?.setHours(0, 0, 0, 0) ?? 0);

            if (
                normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
            ) {
                setSelectedPreset(preset.name);
                return;
            }
        }

        setSelectedPreset(undefined);
    };

    const resetValues = (): void => {
        setRange({
            from: typeof initialDateFrom === "string" ? getDateAdjustedForTimezone(initialDateFrom) : initialDateFrom,
            to: initialDateTo
                ? typeof initialDateTo === "string"
                    ? getDateAdjustedForTimezone(initialDateTo)
                    : initialDateTo
                : typeof initialDateFrom === "string"
                  ? getDateAdjustedForTimezone(initialDateFrom)
                  : initialDateFrom,
        });
    };

    useEffect(() => {
        checkPreset();
    }, [range]);

    const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
        if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
        return a.from.getTime() === b.from.getTime() && (!a.to || !b.to || a.to.getTime() === b.to.getTime());
    };

    useEffect(() => {
        if (isOpen && popoverRef.current) {
            setTimeout(() => {
                const rect = popoverRef.current.getBoundingClientRect();
                if (rect.top < 0) {
                    // Check if the top of the popup is above the viewport
                    window.scrollTo({
                        top: window.scrollY + rect.top - 20, // Scroll to the top of the popup with some padding
                        behavior: "smooth",
                    });
                }
            }, 100);
        } else if (!isOpen) {
            // When popover closes, scroll back to top (optional)
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [isOpen]);

    return (
        <Popover
            modal={true}
            open={isOpen}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    resetValues();
                } else {
                    openedRangeRef.current = range;
                }
                setIsOpen(open);
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full relative flex border border-gray-200 rounded overflow-hidden h-10"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex-1 px-3 flex flex-col justify-center border-r cursor-pointer text-left">
                        <div className="text-xs text-gray-500">Check-in</div>
                        <div className="text-sm font-medium">{FormatDate(range.from.toISOString(), "withDay")}</div>
                    </div>
                    <div className="flex-1 px-3 flex flex-col justify-center cursor-pointer text-left">
                        <div className="text-xs text-gray-500">Check-out</div>
                        <div className="text-sm font-medium">
                            {FormatDate((range.to || range.from).toISOString(), "withDay")}
                        </div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                ref={popoverRef}
                align={align}
                side="right"
                sideOffset={10}
                className={cn(
                    "z-50 w-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[side=bottom]:slide-in-from-top-2"
                )}
                avoidCollisions={false}
            >
                <div className="flex py-2">
                    <div className="flex">
                        <div className="flex flex-col">
                            <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <DateInput
                                            value={range.from}
                                            onChange={(date) => {
                                                const toDate = range.to == null || date > range.to ? date : range.to;
                                                setRange((prevRange) => ({
                                                    ...prevRange,
                                                    from: date,
                                                    to: toDate,
                                                }));
                                            }}
                                        />
                                        <div className="py-1">-</div>
                                        <DateInput
                                            value={range.to}
                                            onChange={(date) => {
                                                const fromDate = date < range.from ? date : range.from;
                                                setRange((prevRange) => ({
                                                    ...prevRange,
                                                    from: fromDate,
                                                    to: date,
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Calendar
                                    mode="range"
                                    onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                                        if (value?.from != null) {
                                            setRange({ from: value.from, to: value?.to });
                                        }
                                    }}
                                    selected={range}
                                    numberOfMonths={isSmallScreen ? 1 : 2}
                                    defaultMonth={
                                        new Date(new Date().setMonth(new Date().getMonth() - (isSmallScreen ? 0 : 1)))
                                    }
                                    disabled={{ before: new Date() }} // Disable past dates
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
                        <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                            {PRESETS.map((preset) => (
                                <Button
                                    key={preset.name}
                                    variant="ghost"
                                    onClick={() => {
                                        setPreset(preset.name);
                                    }}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 py-2 pr-4">
                    <Button
                        onClick={() => {
                            setIsOpen(false);
                            resetValues();
                        }}
                        variant="ghost"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setIsOpen(false);
                            if (!areRangesEqual(range, openedRangeRef.current)) {
                                onUpdate?.({ range });
                            }
                        }}
                    >
                        Update
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

DateRangePicker.displayName = "DateRangePicker";
DateRangePicker.filePath = "libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx";
