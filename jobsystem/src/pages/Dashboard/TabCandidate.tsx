import { useCandidateQueries } from "./hooks/useUserQueries";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { getCandidateColumns } from "@/components/molecules/dashboard/columns";
import { Button } from "@/components/ui/button";

const TabCandidate = () => {
    const { candidates, isCandidateLoading } = useCandidateQueries();

    const handleCandidateClick = (id: string) => {
        console.log("Candidate clicked:", id);
        // Navigate or show modal logic here
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Candidates</h1>
                <Button variant="outline">Add Candidate</Button>
            </div>

            <CustomTable
                columns={getCandidateColumns(handleCandidateClick)}
                data={candidates}
                isLoading={isCandidateLoading}
                loadingMessage="Loading candidates..."
            />
        </div>
    );
};

export default TabCandidate;
