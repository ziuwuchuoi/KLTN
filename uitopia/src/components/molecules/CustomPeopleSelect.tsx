import React, { useState } from "react";
import { TbUsers, TbChevronDown, TbMinus, TbPlus } from "react-icons/tb";
import { cn } from "@/components/general.utils";

// CounterItem component for each row in the dropdown
const CounterItem = ({ icon, label, value, onIncrement, onDecrement, min = 0 }) => {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
                {icon}
                <span className="ml-2 text-sm">{label}</span>
            </div>
            <div className="flex items-center">
                <button
                    onClick={onDecrement}
                    disabled={value <= min}
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                        value <= min
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                >
                    <TbMinus size={16} />
                </button>
                <span className="mx-3 w-6 text-center">{value}</span>
                <button
                    onClick={onIncrement}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <TbPlus size={16} />
                </button>
            </div>
        </div>
    );
};

const CustomPeopleSelect = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);

    const handleIncrement = (setter) => () => setter((prev) => prev + 1);
    const handleDecrement =
        (setter, min = 0) =>
        () =>
            setter((prev) => Math.max(min, prev - 1));

    const handleClickOutside = (e) => {
        if (isOpen && !e.target.closest(".people-select-container")) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const displayText = `${adults} Adult(s), ${children} Child, ${rooms} Room`;

    return (
        <div className={cn("relative people-select-container", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-10 px-3 flex items-center justify-between border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
            >
                <div className="flex items-center">
                    <TbUsers className="text-gray-500 mr-2" size={18} />
                    <span className="text-sm">{displayText}</span>
                </div>
                <TbChevronDown className={cn("text-gray-500 transition-transform", isOpen && "transform rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 p-3 bg-white border border-gray-200 rounded shadow-md">
                    <CounterItem
                        icon={<TbUsers className="text-blue-500" size={18} />}
                        label="Adult"
                        value={adults}
                        onIncrement={handleIncrement(setAdults)}
                        onDecrement={handleDecrement(setAdults, 1)}
                        min={1}
                    />

                    <div className="border-t border-gray-100 my-1"></div>

                    <CounterItem
                        icon={<TbUsers className="text-blue-500" size={16} />}
                        label="Children"
                        value={children}
                        onIncrement={handleIncrement(setChildren)}
                        onDecrement={handleDecrement(setChildren)}
                    />

                    <div className="border-t border-gray-100 my-1"></div>

                    <CounterItem
                        icon={<TbUsers className="text-blue-500" size={16} />}
                        label="Room"
                        value={rooms}
                        onIncrement={handleIncrement(setRooms)}
                        onDecrement={handleDecrement(setRooms, 1)}
                        min={1}
                    />

                    <div className="flex justify-end mt-3">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-1 text-sm text-blue-500 font-medium hover:text-blue-600 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomPeopleSelect;
