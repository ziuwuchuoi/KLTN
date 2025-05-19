import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WithId {
    _id: string;
}

interface CustomTableProps<T extends WithId> {
    data: T[];
    columns: Array<{
        header: React.ReactNode;
        cell: (item: T) => React.ReactNode;
        className?: string;
    }>;
    isLoading?: boolean;
    loadingMessage?: string;
}

function CustomTable<T extends WithId>({
    data,
    columns,
    isLoading = false,
    loadingMessage = "Loading...",
}: CustomTableProps<T>) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, i) => (
                            <TableHead key={i} className={col.className}>
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-4">
                                {loadingMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item._id}>
                                {columns.map((col, i) => (
                                    <TableCell key={i} className={col.className}>
                                        {col.cell(item)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default CustomTable;
