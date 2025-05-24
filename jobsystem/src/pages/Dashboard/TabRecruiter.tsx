import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { useUserQueries } from "./hooks/useUserQueries";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabRecruiter = () => {
    const [activeTab, setActiveTab] = useState("recruiters");
    const { userRecruiter, isLoadingRecruiter } = useUserQueries();

    const recruiters = userRecruiter.items || [];

    const columns = [
        {
            header: "Profile",
            cell: (item) => (
                <Avatar>
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ),
            className: "w-[80px]",
        },
        {
            header: "Name",
            cell: (item) => <span className="font-medium">{item.user.name}</span>,
        },
        {
            header: "Email",
            cell: (item) => item.user.email,
        },
        {
            header: "Role",
            cell: (item) => (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {item.user.roles?.includes("candidate") ? "Candidate" : "User"}
                </Badge>
            ),
        },
        {
            header: "CV",
            cell: (item) => (item.cvId ? "Available" : "None"),
        },
        {
            header: "Applied Jobs",
            cell: (item) => (item.appliedJobIds && item.appliedJobIds.length > 0 ? item.appliedJobIds.join(", ") : "-"),
        },
        {
            header: "Actions",
            cell: (item) => (
                <div className="text-right">
                    <Button variant="ghost" size="sm">
                        See more
                    </Button>
                </div>
            ),
            className: "text-right",
        },
    ];

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
                        columns={columns}
                        data={recruiters}
                        isLoading={isLoadingRecruiter}
                        loadingMessage="Loading candidates..."
                    />
                </TabsContent>

                <TabsContent value="requests">
                    <div className="text-center text-muted-foreground">Recruiter requests go here...</div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TabRecruiter;
