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

export interface CandidateUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
    lastLoginDate?: string;
    createdAt?: string;
    updatedAt?: string;
    extraInfo?: {
        position?: string;
        information?: {
            summary?: string;
            skills?: string[];
            experience?: string[];
            education?: string[];
            certifications?: string[];
            languages?: string[];
            projects?: string[];
        };
    };
}

export interface RecruiterUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
    lastLoginDate?: string;
    createdAt?: string;
    updatedAt?: string;
    extraInfo?: {
        companyName?: string;
        companyWebsite?: string;
        position?: string;
    };
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
    permissions?: {
        subject: string;
        action: string;
    }[];
}
