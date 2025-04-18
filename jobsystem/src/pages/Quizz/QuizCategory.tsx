import React from "react";
import { Button } from "@/components/ui/button";
import { Code, Briefcase, MessageCircle, Brain } from "lucide-react";

interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  quizCount: number;
  color: string;
}

interface QuizCategoriesGridProps {
  onSelectCategory: (categoryId: string) => void;
}

const QuizCategoriesList = ({ onSelectCategory }: QuizCategoriesGridProps) => {
  const quizCategories: QuizCategory[] = [
    {
      id: "technical-it",
      title: "Technical IT",
      description: "Test your technical knowledge in programming, networking, cybersecurity, and more",
      icon: <Code className="w-6 h-6" />,
      quizCount: 12,
      color: "from-blue-500 to-blue-700"
    },
    {
      id: "situational",
      title: "Situational Cases",
      description: "Assess how you would handle real-world workplace scenarios and challenges",
      icon: <Briefcase className="w-6 h-6" />,
      quizCount: 8,
      color: "from-purple-500 to-purple-700"
    },
    {
      id: "soft-skills",
      title: "Soft Skills",
      description: "Evaluate your communication, leadership, teamwork, and problem-solving abilities",
      icon: <MessageCircle className="w-6 h-6" />,
      quizCount: 10,
      color: "from-teal-500 to-teal-700"
    },
    {
      id: "personality",
      title: "Personality & MBTI",
      description: "Discover your personality type, work preferences, and character traits",
      icon: <Brain className="w-6 h-6" />,
      quizCount: 6,
      color: "from-amber-500 to-amber-700"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {quizCategories.map((category) => (
          <QuizCategoryCard 
            key={category.id} 
            category={category} 
            onClick={() => onSelectCategory(category.id)} 
          />
        ))}
      </div>
    </div>
  );
};

interface QuizCategoryCardProps {
  category: QuizCategory;
  onClick: () => void;
}

const QuizCategoryCard = ({ category, onClick }: QuizCategoryCardProps) => {
  return (
    <div 
      className="w-full relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-opacity-50 hover:border-blue-400 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Top border color indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}></div>
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start">
          {/* Icon */}
          <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} mr-4 flex-shrink-0`}>
            {category.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">{category.title}</h2>
            <p className="text-gray-400 text-sm mb-3">{category.description}</p>
            
            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{category.quizCount} quizzes available</span>
              <Button 
                className="bg-zinc-800 hover:bg-blue-600 text-xs py-1 px-3 h-8 transition-colors duration-300" 
                variant="secondary"
                size="sm"
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCategoriesList;