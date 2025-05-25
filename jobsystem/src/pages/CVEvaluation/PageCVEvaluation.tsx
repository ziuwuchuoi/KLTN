import CustomHeroSection from "@/components/molecules/CustomHeroSection";

const PageCVEvaluation = () => {
    return (
        <div className="flex flex-col w-full">
            {/* Upload + Hero Section - Fixed height screen */}
            <div className="h-screen flex flex-col items-center justify-center px-6">
                <CustomHeroSection />
            </div>
        </div>
    );
};

export default PageCVEvaluation;
