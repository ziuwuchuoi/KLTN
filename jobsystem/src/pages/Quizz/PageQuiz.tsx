import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import QuizCategoriesList from "./QuizCategoriesList";

const PageQuiz = () => {
    return (
        <div className="flex flex-col w-full">
            {/* Upload + Hero Section - Fixed height screen */}
            <div className="h-screen flex flex-col items-center justify-center px-6">
                <div className="flex flex-col items-center justify-center w-full">
                    <CustomHeroSection
                        title="Quiz"
                        subtitle="Studio"
                        description="Assess your technical knowledge, soft skills, and career readiness through our curated collection of quizzes designed to help you grow."
                        className="mb-10"
                    />
                    <div className="w-full px-6 pb-12">
                        <QuizCategoriesList />
                    </div>
                </div>
            </div>
            {/* 
            <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-zinc-950 flex flex-col items-center justify-center px-6 text-white py-16">
                <FeaturedQuiz onStart={() => {}} />
                <RecentQuizActivities onReview={() => {}} />
            </div> */}
        </div>
    );
};

export default PageQuiz;
