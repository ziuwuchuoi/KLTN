import React, { useState } from "react";
import { TbSearch } from "react-icons/tb";
import { SortOption } from "@/components/molecules/CustomSelect";
import CustomSelect from "@/components/molecules/CustomSelect";

const entertainmentOptions: SortOption[] = [
    { id: "tour", label: "Tour" },
    { id: "activity", label: "Activity" },
];

function FormEntertainmentOption() {
    const [selectedOption, setSelectedOption] = useState<SortOption>(entertainmentOptions[0]);

    const handleOptionChange = (value: { id: string; label: string; group?: string }) => {
        setSelectedOption({
            id: value.id,
            label: value.label,
        });
    };

    return (
        <div className="mt-2 bg-white rounded-lg p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
        </div>
    );
}

export default FormEntertainmentOption;
