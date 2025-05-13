import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserQueries } from "./hooks/useUserQueries";

const TabRecruiter = () => {
    const [activeTab, setActiveTab] = useState("recruiters");
    const { userRecruiter, isLoadingRecruiter } = useUserQueries();
    console.log("userRecruiter", userRecruiter);

    const recruiters = userRecruiter.items || [];

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
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="text-white">
                                <TableRow>
                                    <TableHead className="w-[80px]">Profile</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Job Descriptions</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingRecruiter ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-4">
                                            Loading recruiters...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recruiters.map((recruiter) => (
                                        <TableRow key={recruiter._id}>
                                            <TableCell>
                                                <Avatar>
                                                    <AvatarFallback>{recruiter.user?.avatar}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">{recruiter.user?.name}</TableCell>
                                            <TableCell>{recruiter.user?.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                                    Recruiter
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{recruiter.position || "-"}</TableCell>
                                            <TableCell>
                                                {recruiter.companyName ? (
                                                    <a
                                                        href={`https://${recruiter.companyWebsite}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {recruiter.companyName}
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell>{recruiter.jds?.length || 0}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    See more
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="requests">
                    {/* This can be a separate component or static table */}
                    <div className="text-center text-muted-foreground">Recruiter requests go here...</div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TabRecruiter;
