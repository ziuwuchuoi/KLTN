import { useState } from "react";

export function CustomSearchSelect({ options, placeholder, className, icon }) {
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