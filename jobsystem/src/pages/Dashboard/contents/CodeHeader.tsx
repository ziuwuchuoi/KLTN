"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X, ExternalLink } from "lucide-react";
import type { CodeProblemDetail } from "@/services/code.service";

interface CodeHeaderProps {
    isEditMode: boolean;
    editData: Partial<CodeProblemDetail>;
    displayData: Partial<CodeProblemDetail>;
    difficultyConfig: {
        bg: string;
        text: string;
        border: string;
    };
    getTopicTags: () => string[];
    onEdit: () => void;
    onCancelEdit: () => void;
    onSave: () => void;
    onBasicInfoChange: (field: keyof CodeProblemDetail, value) => void;
    isSaving: boolean;
}

export function CodeHeader({
    isEditMode,
    editData,
    displayData,
    difficultyConfig,
    getTopicTags,
    onEdit,
    onCancelEdit,
    onSave,
    onBasicInfoChange,
    isSaving,
}: CodeHeaderProps) {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="space-y-3 flex-1">
                {isEditMode ? (
                    <div className="space-y-4">
                        <Input
                            value={editData.title || ""}
                            onChange={(e) => onBasicInfoChange("title", e.target.value)}
                            placeholder="Problem title"
                            className="text-2xl font-bold bg-slate-800 border-slate-600 text-white"
                        />
                        <div className="flex items-center gap-4">
                            <Select
                                value={editData.difficulty || ""}
                                onValueChange={(value) => onBasicInfoChange("difficulty", value)}
                            >
                                <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                                    <SelectValue placeholder="Difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                value={editData.sourceUrl || ""}
                                onChange={(e) => onBasicInfoChange("sourceUrl", e.target.value)}
                                placeholder="Source URL (optional)"
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Topic Tags (comma-separated)</label>
                            <Input
                                value={getTopicTags().join(", ")}
                                onChange={(e) =>
                                    onBasicInfoChange(
                                        "topicTags",
                                        e.target.value
                                            .split(",")
                                            .map((tag) => tag.trim())
                                            .filter((tag) => tag)
                                    )
                                }
                                placeholder="Array, Dynamic Programming, Hash Table"
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white leading-tight">{displayData?.title}</h2>
                            <Badge
                                variant="outline"
                                className={`${difficultyConfig.bg} ${difficultyConfig.text} ${difficultyConfig.border}`}
                            >
                                {displayData?.difficulty}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            {displayData?.sourceUrl && (
                                <div className="flex items-center gap-1">
                                    <ExternalLink className="h-4 w-4" />
                                    <a
                                        href={displayData.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        Source
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {getTopicTags().map((tag, index) => (
                                <Badge key={index} variant="secondary" className="bg-purple-900/20 text-purple-400">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end gap-3 ml-4">
                {!isEditMode ? (
                    <Button variant="outline" onClick={onEdit} className="border-gray-600 hover:bg-gray-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Problem
                    </Button>
                ) : (
                    <>
                        <Button variant="outline" onClick={onCancelEdit} className="border-gray-600 hover:bg-gray-700">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={onSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
