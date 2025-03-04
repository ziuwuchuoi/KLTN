import React, { useState } from "react";
import { TbBuildingSkyscraper, TbMapPin, TbSearch, TbArrowsExchange } from "react-icons/tb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from "@/components/molecules/CustomSelect";
import CustomSelect from "@/components/molecules/CustomSelect";
import CustomDateRangePicker from "@/components/molecules/CustomDateRangePicker";
import { Button } from "@/components/ui/button";
import CustomPeopleSelect from "@/components/molecules/CustomPeopleSelect";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const transportationOptions: SortOption[] = [
    { id: "flight", label: "Flight" },
    { id: "bus", label: "Bus" },
    { id: "car", label: "Car" },
    { id: "taxi", label: "Taxi" },
    { id: "train", label: "Train" },
    { id: "boat", label: "Boat" },
];

const destinationOptions = [
    { id: "bali", label: "Bali, Indonesia" },
    { id: "tokyo", label: "Tokyo, Japan" },
    { id: "paris", label: "Paris, France" },
    { id: "newyork", label: "New York, USA" },
    { id: "sydney", label: "Sydney, Australia" },
];

function SearchSelect({ options, placeholder, value, onChange, className }) {
    return (
        <Select value={value?.id} onValueChange={(id) => onChange(options.find((option) => option.id === id))}>
            <SelectTrigger className={`w-full ${className}`}>
                <SelectValue placeholder={placeholder}>{value?.label || placeholder}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function FormTransportationOption() {
    const [selectedOption, setSelectedOption] = useState<SortOption>(transportationOptions[0]);

    const [from, setFrom] = useState(destinationOptions[0]);
    const [to, setTo] = useState(destinationOptions[1]);

    const handleOptionChange = (value: { id: string; label: string; group?: string }) => {
        setSelectedOption({
            id: value.id,
            label: value.label,
        });
    };

    const swapLocations = () => {
        setFrom((prevFrom) => to);
        setTo((prevTo) => from);
    };

    return (
        <div className="mt-2 w-full bg-white rounded-lg p-3 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <CustomSelect
                    options={transportationOptions}
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
                <div className="flex gap-2 items-center w-full md:col-span-3">
                    <SearchSelect
                        options={destinationOptions}
                        placeholder="From"
                        value={from}
                        onChange={setFrom}
                        className="w-full"
                    />
                    <Button onClick={() => swapLocations()} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <TbArrowsExchange size={18} />
                    </Button>
                    <SearchSelect
                        options={destinationOptions}
                        placeholder="To"
                        value={to}
                        onChange={setTo}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <DateRangePicker
                    onUpdate={(values) => console.log(values)}
                    initialDateFrom="2023-01-01"
                    initialDateTo="2023-12-31"
                    align="center"
                    locale="en-GB"
                    
                />
                <CustomPeopleSelect className="w-full" />
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

export default FormTransportationOption;
