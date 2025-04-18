import CustomHeader from "@/components/molecules/CustomHeader";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";
import QuizCategoriesList from "./QuizCategory";
import FeaturedQuiz from "./FeaturedQuiz";
import RecentQuizActivities from "./RecentQuizActivities";

const PageQuiz = () => {
    return (
        <div className="flex flex-col w-full">
            <CustomHeader />

            {/* Upload + Hero Section - Fixed height screen */}
            <div className="h-screen flex flex-col bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 items-center justify-center px-6 text-white">
                <CustomHeroSection />

                <div className="flex px-6 pb-12">
                    <QuizCategoriesList onSelectCategory={() => {}} />
                </div>
            </div>

            <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-zinc-950 flex flex-col items-center justify-center px-6 text-white py-16">
                <FeaturedQuiz onStart={() => {}} />
                <RecentQuizActivities onReview={() => {}} />
            </div>
        </div>
    );
};

export default PageQuiz;
