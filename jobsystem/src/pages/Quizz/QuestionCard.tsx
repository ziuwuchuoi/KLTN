import { Quiz } from "./hooks/useQuizQueries";
import { cn } from "@/components/utils/general.utils";
import QuizResult from "./QuizResult";

type QuestionCardProps = {
  question: Quiz;
  questionNumber: number;
  onSelectOption: (questionNumber: number, selectedAnswer: number) => void;
  userAnswer?: number;
  showResults: boolean;
};

const QuestionCard = ({ 
  question, 
  questionNumber, 
  onSelectOption, 
  userAnswer, 
  showResults 
}: QuestionCardProps) => {
  const handleSelectOption = (optionIndex: number) => {
    if (showResults) return; // Prevent changing answer after submission
    onSelectOption(questionNumber, optionIndex);
  };

  return (
    <div 
      id={`question-${questionNumber}`}
      className="bg-quiz-card p-6 rounded-lg mb-8 animate-fade-in scroll-mt-24"
    >
      <h2 className="text-xl font-semibold mb-6">Question {questionNumber}</h2>
      <p className="text-lg mb-6">{question.question}</p>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectOption(index)}
            disabled={showResults}
            className={cn(
              "w-full text-left p-4 rounded-lg transition-all",
              showResults 
                ? (index === question.correctAnswer 
                    ? "bg-green-500/20 border border-green-500 text-white" 
                    : userAnswer === index 
                      ? "bg-red-500/20 border border-red-500 text-gray-200"
                      : "bg-quiz-option text-gray-200")
                : userAnswer === index
                  ? "bg-quiz-option-selected text-white"
                  : "bg-quiz-option text-gray-200 hover:bg-quiz-option-hover"
            )}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm border",
                  showResults
                    ? (index === question.correctAnswer 
                        ? "border-green-500 bg-green-500/20"
                        : userAnswer === index 
                          ? "border-red-500 bg-red-500/20"
                          : "border-gray-400")
                    : userAnswer === index
                      ? "border-white bg-transparent"
                      : "border-gray-400"
                )}>
                  {String.fromCharCode(65 + index)}
                </div>
              </div>
              <span className="pt-1">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {showResults && userAnswer !== undefined && (
        <QuizResult 
          question={question} 
          selectedAnswer={userAnswer} 
          showExplanation={true} 
        />
      )}
    </div>
  );
};

export default QuestionCard;
