"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Clock, HelpCircle } from "lucide-react";
import type { QuizItem } from "@/services/quiz.service";

interface QuizHeaderProps {
    isEditMode: boolean;
    editData: Partial<QuizItem>;
    displayData: Partial<QuizItem>;
    onEdit: () => void;
    onCancelEdit: () => void;
    onSave: () => void;
    onBasicInfoChange: (field: keyof QuizItem, value) => void;
    isSaving: boolean;
}

export function QuizHeader({
    isEditMode,
    editData,
    displayData,
    onEdit,
    onCancelEdit,
    onSave,
    onBasicInfoChange,
    isSaving,
}: QuizHeaderProps) {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="space-y-3 flex-1">
                {isEditMode ? (
                    <div className="space-y-4">
                        <Input
                            value={editData.title || ""}
                            onChange={(e) => onBasicInfoChange("title", e.target.value)}
                            placeholder="Quiz title"
                            className="text-2xl font-bold bg-slate-800 border-slate-600 text-white"
                        />
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <Input
                                    type="number"
                                    min="1"
                                    value={editData.duration || ""}
                                    onChange={(e) =>
                                        onBasicInfoChange("duration", Number.parseInt(e.target.value) || 0)
                                    }
                                    placeholder="Duration"
                                    className="w-20 bg-slate-800 border-slate-600 text-white"
                                />
                                <span className="text-gray-400">minutes</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Categories (comma-separated)</label>
                            <Input
                                value={editData.categories?.join(", ") || ""}
                                onChange={(e) =>
                                    onBasicInfoChange(
                                        "categories",
                                        e.target.value
                                            .split(",")
                                            .map((c) => c.trim())
                                            .filter((c) => c)
                                    )
                                }
                                placeholder="React, JavaScript, Frontend"
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white leading-tight">{displayData?.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{displayData?.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <HelpCircle className="h-4 w-4" />
                                <span>{displayData?.questions?.length || 0} questions</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {displayData?.categories?.map((category, index) => (
                                <Badge key={index} variant="secondary" className="bg-blue-900/20 text-blue-400">
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end gap-2 ml-4">
                {!isEditMode ? (
                    <Button variant="outline" onClick={onEdit} className="border-gray-600 hover:bg-gray-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Quiz
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
