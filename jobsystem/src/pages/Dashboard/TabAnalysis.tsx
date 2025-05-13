import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AreaChart, BarChart, LineChart } from "recharts";

const TabAnalysis = () => {
    // Sample data for charts
    const [candidateData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "New Candidates",
                data: [33, 53, 85, 41, 44, 65],
                fill: true,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgb(59, 130, 246)",
            },
        ],
    });

    const [recruiterData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "New Recruiters",
                data: [15, 23, 31, 24, 32, 38],
                backgroundColor: "rgb(99, 102, 241)",
            },
        ],
    });

    const [hiringData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Successful Placements",
                data: [12, 19, 27, 29, 36, 42],
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
            },
        ],
    });

    return (
        <div className="w-full">
            <div>
                <h1 className="text-3xl font-bold mb-6">Dashboard Analytics</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Candidate Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AreaChart
                            data={candidateData}
                            className="h-64"
                            options={{
                                scales: { y: { beginAtZero: true } },
                                elements: { line: { tension: 0.3 } },
                            }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recruiter Onboarding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={recruiterData}
                            className="h-64"
                            options={{ scales: { y: { beginAtZero: true } } }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Successful Placements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={hiringData}
                            className="h-64"
                            options={{
                                scales: { y: { beginAtZero: true } },
                                elements: { line: { tension: 0.3 } },
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">New applications this week</div>
                                <div className="font-medium">124</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">Interviews scheduled</div>
                                <div className="font-medium">76</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">Positions filled</div>
                                <div className="font-medium">18</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">Pending evaluations</div>
                                <div className="font-medium">32</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recruitment Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-medium">Time to hire (avg.)</div>
                                    <div className="text-sm font-medium">78%</div>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-primary" style={{ width: "78%" }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-medium">Candidate satisfaction</div>
                                    <div className="text-sm font-medium">92%</div>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-green-500" style={{ width: "92%" }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-medium">Recruiter performance</div>
                                    <div className="text-sm font-medium">86%</div>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-blue-500" style={{ width: "86%" }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-medium">Processing speed</div>
                                    <div className="text-sm font-medium">69%</div>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-amber-500" style={{ width: "69%" }} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TabAnalysis;
