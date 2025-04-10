export type UserRole = "admin" | "candidate" | "recruiter";

export interface BaseUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    avatarPath?: string;
    avatarUrl?: string;
    createdAt?: Date;
    fileIds?: string[];
    lastSeen?: Date;
    lastQuotaReset?: Date;
    auth: {
        method: "google" | "email";
    };
}