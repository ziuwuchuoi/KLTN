export type UserRole = "admin" | "candidate" | "recruiter";
export type QuizCategory = "technical" | "case" | "personality";

export type TechnicalSubCategory =
    | "javascript"
    | "typescript"
    | "html"
    | "css"
    | "sass"
    | "react"
    | "vue"
    | "angular"
    | "nextjs"
    | "nodejs"
    | "express"
    | "nestjs"
    | "frontend"
    | "backend"
    | "fullstack"
    | "database"
    | "sql"
    | "nosql"
    | "mongodb"
    | "postgresql"
    | "networking"
    | "cloud"
    | "aws"
    | "azure"
    | "gcp"
    | "devops"
    | "docker"
    | "kubernetes"
    | "ci/cd"
    | "testing"
    | "jest"
    | "cypress"
    | "security"
    | "linux"
    | "algorithms"
    | "data-structures"
    | "system-design"
    | "machine-learning"
    | "ai"
    | "data-science"
    | "web3"
    | "blockchain"
    | "mobile"
    | "flutter"
    | "react-native";

export type SituationTrait =
    | "communication"
    | "problem-solving"
    | "critical-thinking"
    | "leadership"
    | "team-collaboration"
    | "conflict-resolution"
    | "adaptability";

export type PersonalityTrait = "openness" | "conscientiousness" | "extroversion" | "agreeableness" | "neuroticism";

export interface BaseUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;

    auth?: "google" | "email"; // first created? idk optional
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BaseCandidate extends BaseUser {
    role: "candidate";

    listCvIds?: string[]; // Candidate's CVs
    listJdIds?: string[]; // JDs uploaded by candidate
    listEvaluationIds?: string[]; // Evaluation result history, BaseEvaluation._id
}

export interface BaseRecruiter extends BaseUser {
    role: "recruiter";

    position?: string; // recruiter's position in the team
    companyName: string;
    companyWebsite?: string;
    listJdIds?: string[]; // JD created and uploaded by recruiter
}

export interface BaseAdmin extends BaseUser {
    role: "admin";

    permissions?: string[];
}

export type BaseAllUser = BaseCandidate | BaseRecruiter | BaseAdmin;

export interface BaseCV {
    _id: string;
    candidateId: string;
    fileUrl: string;
    fileName?: string;
    createdAt?: Date;
    information?: BaseInformation;
    listEvaluationIds?: string[]; // chua biet nay co link voi BaseEvaluation kh
}

export interface BaseEvaluation {
    _id: string;
    cvId: string; // candidate's CV ID
    jdId: string; // job Description ID

    // Evaluation Summary
    similarityScore?: number; // Similarity between CV and JD (%)
    fitLevel?: "Low" | "Medium" | "High"; // Overall suitability

    // Skill & Experience Matching
    matchedSkills: string[];
    missingSkills?: string[];
    matchedExperience: string[];
    experienceRelevance?: string[]; // Relevance of past experience to the job
    achievementImpact?: string[]; // Measurable or notable outcomes from previous roles

    // Qualitative Feedback
    feedback: string[]; // General feedback or evaluator notes
    softSkills?: string[]; // Observed or inferred soft skills (e.g. communication, teamwork)
    additionalSkills?: string[]; // Other relevant but non-required skills (e.g. languages, tools)

    // AI-Generated Analysis
    aiReview?: {
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
    };

    // ATS Compatibility Check
    atsCheck?: {
        formattingTips: string[];
        issues: string[];
        recommendations: string[];
    };

    createdAt?: Date;
    updatedAt?: Date;
}

export interface BaseJD {
    _id: string;
    creatorUserId: string; // can be uploaded by candidate or recruiter
    title: string; // role, position
    description: string;
    companyName?: string; // public JD is required
    location?: string;
    requirements: BaseInformation; // extract into this
    benefits: string[]; // salary, working hours, activities,...
    createdAt?: Date;
    lastUpdatedAt?: Date;
    visibility?: "private" | "public"; // for candidate: always private; for recruiter: both
}

export interface BaseInformation {
    experience: string[]; // experience in working
    skills: string[]; // included softskills and technical skills
    education?: string[];
    projects?: string[]; // school, personal projects,...
    summary?: string; // like personal introduction,...
    certifications?: string[];
    languages?: string[];
}

export interface BaseApplication {
    _id: string;
    candidateId: string;
    cvId: string;
    jdId: string;
    evaluation?: Partial<BaseEvaluation>; // whether candidate does evaluation in this jd from recruiter, some parts
    createdAt: Date;
    status: "pending" | "shortlisted" | "rejected" | "accepted";
}

export interface BaseQuiz {
    _id: string;
    title: string;
    description?: string;
    category: QuizCategory;
    createdAt?: Date;
    updatedAt?: Date;

    questions: BaseQuizQuestion[];
    durationInMinutes?: number;
    totalScore?: number;
}

interface BaseQuestion {
    _id: string;
}

export type BaseQuizQuestion = BaseTechnicalQuestion | BaseSituationCaseQuestion | BasePersonalityQuestion;

export interface BaseTechnicalQuestion extends BaseQuestion {
    type: "technical";
    subCategory: TechnicalSubCategory; // e.g., javascript, react,...
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    score: number;
}

export interface BaseSituationCaseQuestion extends BaseQuestion {
    type: "case";
    trait: SituationTrait; // e.g., communication, problem-solving
    scenario: string;
    question: string;
    answerType: "text" | "multiple-choice";
    options?: string[];
    expectedTraits?: string[]; // optional, multi-trait mapping
    score?: number;
}

export interface BasePersonalityQuestion extends BaseQuestion {
    type: "personality";
    statement: string;
    scale: number;
    traitMeasured: PersonalityTrait; // e.g., openness, etc.
}
