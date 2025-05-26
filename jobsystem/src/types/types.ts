export type UserRole = "admin" | "candidate" | "recruiter";
export type QuizCategory = "technical" | "case" | "personality";

export interface BaseUser {
    _id: string;
    name: string;
    email: string;
    roles: UserRole[];
    avatar?: string;
    canBeRecruiter: boolean;
    loginTime: number;
    lastLoginDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    googleAccessToken?: string;
    googleRefreshToken?: string;
}

export interface BaseAdmin {
    _id: string;
    role: string;
    name: string;
    email: string;
    phoneNumber: string;
    permissions: { subject: string; action: string }[];
    createdAt?: Date;
    updatedAt?: Date;
}
