import React, { useState } from "react";
import { TbSearch, TbBuildingSkyscraper, TbMapPin } from "react-icons/tb";
import { SortOption } from "@/components/molecules/CustomSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomSelect from "@/components/molecules/CustomSelect";
import CustomPeopleSelect from "@/components/molecules/CustomPeopleSelect";
import CustomDateRangePicker from "@/components/molecules/CustomDateRangePicker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const accomodationOptions: SortOption[] = [
    { id: "hotel", label: "Hotel" },
    { id: "homestay", label: "Home Stay" },
    { id: "apartment", label: "Apartment" },
    { id: "villa", label: "Villa" },
    { id: "resort", label: "Resort" },
];

function SearchSelect({ options, placeholder, className, icon }) {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selected, setSelected] = useState(null);

    const filteredOptions = search
        ? options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
        : options;

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-center border border-gray-200 rounded px-3 h-10 focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all">
                {icon && <div className="text-gray-500 mr-2">{icon}</div>}
                <input
                    type="text"
                    placeholder={selected ? selected.label : placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="outline-none text-sm w-full"
                />
            </div>

            {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-md max-h-48 overflow-auto">
                    {filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            onClick={() => {
                                setSelected(option);
                                setSearch("");
                                setShowDropdown(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                    {filteredOptions.length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-sm">No options found</div>
                    )}
                </div>
            )}
        </div>
    );
}

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
                    <SearchSelect
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
