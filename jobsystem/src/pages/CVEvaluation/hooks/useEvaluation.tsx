import { useState, useRef } from 'react';
import { Toaster } from '@/components/ui/sonner';

export const useEvaluation = () => {
  const [cv, setCv] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleEvaluate = () => {
    if (!cv || !jobDescription) {
      console.log("Please upload both your CV and the job description");
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const mockResult = {
        overallScore: 78,
        summary: "Your CV matches 78% of the job requirements...",
        keyFindings: [
          "Your technical skills closely align...",
          "You have 3+ years of relevant experience...",
          "Several key technologies mentioned...",
          "Your CV lacks emphasis on team leadership...",
          "Your education background is a strong match..."
        ],
        skillMatches: [
          { skill: "React.js", level: 90, required: true },
          { skill: "TypeScript", level: 85, required: true },
          { skill: "Node.js", level: 75, required: false },
          { skill: "AWS", level: 60, required: false },
          { skill: "Team Leadership", level: 35, required: true }
        ],
        matchCriteria: [
          { criteria: "Years of Experience", matched: true, description: "..." },
          { criteria: "Education", matched: true, description: "..." },
          { criteria: "Technical Skills", matched: true, description: "..." },
          { criteria: "Leadership Experience", matched: false, description: "..." },
          { criteria: "Industry Knowledge", matched: true, description: "..." }
        ],
        missingKeywords: [
          "Team management",
          "Agile coaching",
          "CI/CD pipeline",
          "Performance optimization",
          "Stakeholder communication"
        ],
        suggestions: [
          "Add specific examples of leadership...",
          "Include metrics or quantifiable achievements...",
          "Highlight any experience with CI/CD...",
          "Add a brief section about Agile...",
          "Consider a summary that addresses job requirements..."
        ]
      };

      setEvaluationResult(mockResult);
      setIsEvaluating(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 3000);
  };

  const scrollToResults = () => resultRef.current?.scrollIntoView({ behavior: 'smooth' });

  return {
    cv,
    setCv,
    jobDescription,
    setJobDescription,
    isEvaluating,
    handleEvaluate,
    evaluationResult,
    resultRef,
    scrollToResults
  };
};
