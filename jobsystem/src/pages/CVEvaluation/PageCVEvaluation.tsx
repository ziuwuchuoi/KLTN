import { Button } from "@/components/ui/button";
import { useEvaluation } from "./hooks/useEvaluation";
import CustomImportFile from "@/components/molecules/media/CustomImportFile";
import { TbChartRadar, TbUpload } from "react-icons/tb";
import { useState, useEffect } from "react";
import CustomUploadBox from "@/components/molecules/media/CustomUploadBox";
import CustomHeroSection from "@/components/molecules/CustomHeroSection";

const PageCVEvaluation = () => {
    const {
        cv,
        setCv,
        jobDescription,
        setJobDescription,
        isEvaluating,
        handleEvaluate,
        evaluationResult,
        resultRef,
        scrollToResults,
    } = useEvaluation();

    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (evaluationResult) {
            scrollToResults();
        }
    }, [evaluationResult, scrollToResults]);

    return (
        <div className="flex flex-col w-full">
            {/* Upload + Hero Section - Fixed height screen */}
            <div className="h-screen flex flex-col items-center justify-center px-6">
                <CustomHeroSection />

                {/* File Upload Section */}
                <div className="w-full max-w-3xl glass-card rounded-xl p-8 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomImportFile onSingleFileChange={setCv} dropTitle="Drop your CV file here to add">
                            <CustomUploadBox fileName={cv?.name} fileType="CV" type="PDF, DOC, DOCX" />
                        </CustomImportFile>

                        <CustomImportFile
                            accept=".pdf"
                            dropTitle="Drop JD file here to add"
                            onSingleFileChange={setJobDescription}
                        >
                            <CustomUploadBox fileName={jobDescription?.name} fileType="JD" type="PDF" />
                        </CustomImportFile>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button
                            className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-700 text-white px-8 py-6 rounded-lg text-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/30"
                            onClick={handleEvaluate}
                            disabled={isEvaluating || !cv || !jobDescription}
                        >
                            {isEvaluating ? (
                                <>
                                    <span className="animate-spin mr-2">⟳</span>
                                    <span>Evaluating</span>
                                </>
                            ) : (
                                <>
                                    <TbChartRadar className="w-5 h-5" />
                                    <span>Evaluate My Application</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Scroll indicator when results are available */}
                {evaluationResult && (
                    <div className="absolute bottom-8 animate-bounce">
                        <p className="text-gray-400 text-sm">Scroll down to see results</p>
                        <div className="flex justify-center mt-2">
                            <svg
                                className="w-6 h-6 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Evaluation Result Section - Separate section that appears when results are available */}
            {evaluationResult && (
                <div
                    ref={resultRef}
                    className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-zinc-950 flex flex-col items-center justify-center px-6 text-white py-16"
                >
                    <div className="w-full max-w-5xl glass-card rounded-xl p-8">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">
                                Evaluation Results
                            </span>
                        </h2>

                        {/* Display your evaluation results here */}
                        <div className="prose prose-invert max-w-none">
                            {/* Assuming evaluationResult is HTML or can be rendered as such */}
                            <div dangerouslySetInnerHTML={{ __html: evaluationResult }} />
                        </div>

                        {/* Button to scroll back to top */}
                        <div className="mt-10 flex justify-center">
                            <Button
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-700 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                Back to Upload
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageCVEvaluation;
