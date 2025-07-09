import React from "react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/components/utils/general.utils";

interface WithId {
    _id: string;
}

interface CustomTableColumn<T> {
    header: React.ReactNode;
    cell: (item: T) => React.ReactNode;
    className?: string;
}

interface CustomTableProps<T extends WithId> {
    data: T[];
    columns: CustomTableColumn<T>[];
    isLoading?: boolean;
    loadingMessage?: string;
    onRowClick?: (item: T) => void;
    className?: string;
    expandable?: boolean;
    expandedContent?: (item: T) => React.ReactNode;
    emptyMessage?: string;
    loadingRows?: number;
}

export function CustomTable<T extends WithId>({
    data,
    columns,
    isLoading = false,
    loadingMessage = "Loading...",
    onRowClick,
    className,
    expandable = false,
    expandedContent,
    emptyMessage = "No data available",
    loadingRows = 10,
}: CustomTableProps<T>) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRowExpansion = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleRowClick = (item: T, event: React.MouseEvent) => {
        // Don't trigger row click if clicking on interactive elements
        const target = event.target as HTMLElement;
        if (target.closest("button") || target.closest("a") || target.closest("[role='button']")) {
            return;
        }

        if (expandable) {
            toggleRowExpansion(item._id);
        }

        onRowClick?.(item);
    };

    return (
        <Card className={cn("bg-slate-800/50 border-slate-700", className)}>
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-700">
                        {expandable && <TableHead className="w-8 text-slate-300"></TableHead>}
                        {columns.map((column, index) => (
                            <TableHead key={index} className={cn("text-slate-300", column.className)}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: loadingRows }).map((_, i) => (
                            <TableRow key={i} className="border-slate-700">
                                {expandable && (
                                    <TableCell>
                                        <div className="h-4 bg-slate-700 animate-pulse rounded w-4" />
                                    </TableCell>
                                )}
                                {columns.map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <div className="h-4 bg-slate-700 animate-pulse rounded" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : data.length === 0 ? (
                        <TableRow className="border-slate-700">
                            <TableCell
                                colSpan={columns.length + (expandable ? 1 : 0)}
                                className="text-center py-8 text-slate-400"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <React.Fragment key={item._id}>
                                <TableRow
                                    className={cn(
                                        "cursor-pointer hover:bg-slate-700/50 border-slate-700",
                                        expandedRows.has(item._id) && "bg-slate-700/30"
                                    )}
                                    onClick={(e) => handleRowClick(item, e)}
                                >
                                    {expandable && (
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-0 h-6 w-6"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleRowExpansion(item._id);
                                                }}
                                            >
                                                {expandedRows.has(item._id) ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={colIndex} className={column.className}>
                                            {column.cell(item)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {expandable && expandedRows.has(item._id) && expandedContent && (
                                    <TableRow className="border-slate-700">
                                        <TableCell colSpan={columns.length + 1} className="bg-slate-900/50 p-4">
                                            {expandedContent(item)}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}