import React, { useState } from "react";
import { TbSearch, TbBuildingSkyscraper, TbMapPin } from "react-icons/tb";
import { SortOption } from "@/components/molecules/CustomSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomSelect from "@/components/molecules/CustomSelect";
import CustomPeopleSelect from "@/components/molecules/CustomPeopleSelect";
import CustomDateRangePicker from "@/components/molecules/CustomDateRangePicker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { CustomSearchSelect } from "@/components/molecules/CustomSearchSelect";

const accomodationOptions: SortOption[] = [
    { id: "hotel", label: "Hotel" },
    { id: "homestay", label: "Home Stay" },
    { id: "apartment", label: "Apartment" },
    { id: "villa", label: "Villa" },
    { id: "resort", label: "Resort" },
];



function FormAccommodationOption() {
    const [selectedOption, setSelectedOption] = useState<SortOption>(accomodationOptions[0]);
    const [showFlights, setShowFlights] = useState(false);

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
        <div className="mt-2 w-full bg-white rounded-lg p-3 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <CustomSelect
                    options={accomodationOptions}
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

            {/* Second row: Date range picker and Guest counter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 relative">
                <DateRangePicker />
                <CustomPeopleSelect className="w-full" />
            </div>

            {/* Third row: Date range picker and Guest counter */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 relative">
                
            </div>

            {/* Search button */}
            <div>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium text-sm flex items-center justify-center transition-colors">
                    <TbSearch className="mr-1" size={16} />
                    Search
                </button>
            </div>
        </div>
    );
}

export default FormAccommodationOption;
