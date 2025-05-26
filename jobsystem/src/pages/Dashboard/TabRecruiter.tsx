import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { useRecruiterQueries } from "./hooks/useUserQueries";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRecruiterColumns, getRequestRecruiterColumns } from "@/components/molecules/dashboard/columns";

const TabRecruiter = () => {
    const [activeTab, setActiveTab] = useState("recruiters");
    const { recruiters, requestedRecruiters, isRecruiterLoading } = useRecruiterQueries();

    const handleRecruiterClick = () => {};

    const handleRequestRecruiterClick = () => {};

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Recruiters</h1>
                <Button variant="outline">Add Recruiter</Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="recruiters">Active Recruiters</TabsTrigger>
                    <TabsTrigger value="requests">Recruiter Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="recruiters">
                    <CustomTable
                        columns={getRecruiterColumns(handleRecruiterClick)}
                        data={recruiters}
                        isLoading={isRecruiterLoading}
                        loadingMessage="Loading recruiter..."
                    />
                </TabsContent>

                <TabsContent value="requests">
                    <CustomTable
                        columns={getRequestRecruiterColumns(handleRequestRecruiterClick)}
                        data={requestedRecruiters}
                        isLoading={isRecruiterLoading}
                        loadingMessage="Loading recruiter..."
                    />{" "}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TabRecruiter;
