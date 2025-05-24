"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Filter, X, Search } from "lucide-react";

interface TopicFilterProps {
    availableTags: string[];
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    isLoading?: boolean;
}

export const CustomTopicFilter = ({ availableTags, selectedTags, onTagsChange, isLoading }: TopicFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTags = availableTags.filter((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter((t) => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    };

    const handleClearAll = () => {
        onTagsChange([]);
    };

    const handleSelectAll = () => {
        onTagsChange(filteredTags);
    };

    return (
        <div className="flex items-center gap-2">
            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 max-w-md">
                    {selectedTags.slice(0, 3).map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            onClick={() => handleTagToggle(tag)}
                        >
                            {tag}
                            <X className="w-3 h-3 ml-1" />
                        </Badge>
                    ))}
                    {selectedTags.length > 3 && (
                        <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                            +{selectedTags.length - 3} more
                        </Badge>
                    )}
                </div>
            )}

            {/* Filter Button */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="border-slate-700 bg-slate-800 hover:bg-slate-700">
                        <Filter className="w-4 h-4 mr-2" />
                        Topics
                        {selectedTags.length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-blue-600 text-white">
                                {selectedTags.length}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-slate-800 border-slate-700" align="start">
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">Filter by Topics</h4>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSelectAll}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    Select All
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="text-xs text-slate-400 hover:text-slate-300"
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-700 border-slate-600 text-white"
                            />
                        </div>

                        {/* Topics List */}
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {isLoading ? (
                                <div className="text-center py-4 text-slate-400">Loading topics...</div>
                            ) : filteredTags.length === 0 ? (
                                <div className="text-center py-4 text-slate-400">No topics found</div>
                            ) : (
                                filteredTags.map((tag) => (
                                    <div key={tag} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={tag}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() => handleTagToggle(tag)}
                                            className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <label
                                            htmlFor={tag}
                                            className="text-sm text-slate-300 cursor-pointer hover:text-white flex-1"
                                        >
                                            {tag}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                            <span className="text-xs text-slate-400">
                                {selectedTags.length} of {availableTags.length} selected
                            </span>
                            <Button
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
