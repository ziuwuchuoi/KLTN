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
            <div className="h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-gray-900 px-6 text-white flex items-center justify-center">
                <div className="flex flex-col items-center justify-center w-full">
                    <CustomHeroSection className="mb-20"/>
                    <div className="w-full px-6 pb-12">
                        <QuizCategoriesList />
                    </div>
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
