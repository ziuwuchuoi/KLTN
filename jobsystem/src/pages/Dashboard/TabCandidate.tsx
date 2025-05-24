import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/molecules/dashboard/CustomTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserQueries } from "./hooks/useUserQueries";

const TabCandidate = () => {
    const { userCandidate, isLoadingCandidate } = useUserQueries();

    const candidates = userCandidate?.items || [];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Candidates</h1>
                <Button variant="outline">Add Candidate</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Profile</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>CV</TableHead>
                            <TableHead>Applied Jobs</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingCandidate ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    Loading candidates...
                                </TableCell>
                            </TableRow>
                        ) : (
                            candidates.map((candidate) => (
                                <TableRow key={candidate._id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={candidate.user?.avatar} alt={candidate.user?.name} />
                                            <AvatarFallback>{candidate.user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{candidate.user?.name}</TableCell>
                                    <TableCell>{candidate.user?.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                            {candidate.user?.roles?.includes("candidate") ? "Candidate" : "User"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{candidate.cvId ? "Available" : "None"}</TableCell>
                                    <TableCell>
                                        {candidate.appliedJobIds?.length > 0 ? candidate.appliedJobIds.join(", ") : "-"}
                                    </TableCell>
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
        </div>
    );
};

export default TabCandidate;
