import React, { useState } from "react";
import { TbBuildingSkyscraper, TbMapPin, TbSearch } from "react-icons/tb";
import { SortOption } from "@/components/molecules/CustomSelect";
import CustomSelect from "@/components/molecules/CustomSelect";
import { CustomSearchSelect } from "@/components/molecules/CustomSearchSelect";

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

    const destinationOptions = [
        { id: "bali", label: "Bali, Indonesia" },
        { id: "tokyo", label: "Tokyo, Japan" },
        { id: "paris", label: "Paris, France" },
        { id: "newyork", label: "New York, USA" },
        { id: "sydney", label: "Sydney, Australia" },
    ];

    return (
        <div className="mt-2 w-full bg-white rounded-lg p-4 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <CustomSelect
                    options={entertainmentOptions}
                    selectedValue={selectedOption}
                    onChange={handleOptionChange}
                    customRenderItem={(item) => <span>{item.label}</span>}
                    onChangeValue={(item) => item.id}
                    displayValue={(item) => (
                        <div className="flex items-center">
                            <TbBuildingSkyscraper className="mr-2 text-gray-500" />
                            <span>{item.label}</span>
                        </div>
                    )}
                    className="w-full h-10 text-sm"
                    itemClassName="text-sm h-8"
                />
                <div className="md:col-span-3">
                    <CustomSearchSelect
                        options={destinationOptions}
                        placeholder="Where are you going?"
                        icon={<TbMapPin size={18} />}
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium text-sm flex items-center justify-center transition-colors">
                    <TbSearch className="mr-1" size={16} />
                    Search
                </button>
            </div>
        </div>
    );
}

export default FormEntertainmentOption;
