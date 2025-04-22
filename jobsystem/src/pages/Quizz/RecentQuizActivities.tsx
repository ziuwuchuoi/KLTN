import React from "react";
import { Button } from "@/components/ui/button";

interface Activity {
    id: string;
    title: string;
    category: string;
    score: string;
    date: string;
    improvement: string | null;
}

interface ActivityItemProps {
    activity: Activity;
    onReview: () => void;
}

interface RecentActivitiesSectionProps {
    onReview: (id: string) => void;
}

const ActivityItem = ({ activity, onReview }: ActivityItemProps) => {
    return (
        <div className="p-6 hover:bg-zinc-800/30 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-lg">{activity.title}</h3>
                    <p className="text-sm text-gray-500">
                        {activity.category} • {activity.date}
                    </p>
                </div>
                <div className="flex items-center">
                    <div className="text-right mr-4">
                        <div className="font-bold text-lg">{activity.score}</div>
                        {activity.improvement && <div className="text-sm text-green-400">{activity.improvement}</div>}
                    </div>
                    <Button onClick={onReview} variant="ghost" className="bg-zinc-800 hover:bg-indigo-600">
                        Review
                    </Button>
                </div>
            </div>
        </div>
    );
};

const RecentQuizActivities = ({ onReview }: RecentActivitiesSectionProps) => {
    const activities: Activity[] = [
        {
            id: "react-quiz",
            title: "React Fundamentals Quiz",
            category: "Technical IT",
            score: "85%",
            date: "April 8, 2025",
            improvement: "+12%",
        },
        {
            id: "conflict-resolution",
            title: "Conflict Resolution",
            category: "Soft Skills",
            score: "70%",
            date: "April 3, 2025",
            improvement: "+5%",
        },
        {
            id: "mbti-test",
            title: "MBTI Personality Test",
            category: "Personality",
            score: "INTJ",
            date: "March 28, 2025",
            improvement: null,
        },
    ];

    return (
        <div className="w-[80%]">
            <h2 className="text-2xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">
                    Your Recent Activities
                </span>
            </h2>

            <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <div className="divide-y divide-zinc-800">
                    {activities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} onReview={() => onReview(activity.id)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentQuizActivities;
