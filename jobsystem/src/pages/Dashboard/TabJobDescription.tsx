import { useState } from "react";
import { cn } from "@/components/utils/general.utils";
import { JDItem } from "@/services/file.service";
import { useJDQueries } from "../CVEvaluation/hooks/useFileQueries";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getJDColumns } from "@/components/molecules/dashboard/columns";

const TabJobDescription = () => {
    const [selectedJD, setSelectedJD] = useState<JDItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { jds, isJDDataLoading } = useJDQueries();

    const handleJDClick = (jdId: string) => {
        const jd = jds?.find((jd) => jd._id === jdId);
        if (jd) {
            setSelectedJD(jd);
            setIsDialogOpen(true);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Job Description</h1>
                <Button variant="outline">Add JD</Button>
            </div>

            <CustomTable
                columns={getJDColumns(handleJDClick)}
                data={jds || []}
                isLoading={isJDDataLoading}
                loadingMessage="Loading job description..."
                emptyMessage="No active jds found"
                className="bg-slate-800/50 border-slate-700"
            />
        </div>
    );
};

export default TabJobDescription;
