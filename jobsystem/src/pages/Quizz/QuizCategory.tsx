import React from "react";
import { Button } from "@/components/ui/button";
import { TbCode, TbBriefcase, TbMessageCircle, TbBrain } from "react-icons/tb";

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
      icon: <TbCode className="w-10 h-10" />,
      quizCount: 12,
      color: "from-blue-500 to-blue-700"
    },
    {
      id: "situational",
      title: "Situational Cases",
      description: "Assess how you would handle real-world workplace scenarios and challenges",
      icon: <TbBriefcase className="w-10 h-10" />,
      quizCount: 8,
      color: "from-purple-500 to-purple-700"
    },
    {
      id: "soft-skills",
      title: "Soft Skills",
      description: "Evaluate your communication, leadership, teamwork, and problem-solving abilities",
      icon: <TbMessageCircle className="w-10 h-10" />,
      quizCount: 10,
      color: "from-teal-500 to-teal-700"
    },
    {
      id: "personality",
      title: "Personality & MBTI",
      description: "Discover your personality type, work preferences, and character traits",
      icon: <TbBrain className="w-10 h-10" />,
      quizCount: 6,
      color: "from-amber-500 to-amber-700"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      className="glass-card relative overflow-hidden rounded-xl border border-zinc-800 hover:border-indigo-500 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Gradient overlay at the top */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${category.color}`}></div>
      
      <div className="p-8">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} mr-4`}>
            {category.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
            <p className="text-gray-400 mb-4">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{category.quizCount} quizzes available</span>
              <Button 
                className="bg-zinc-800 hover:bg-indigo-600 transition-colors duration-300"
                variant="ghost"
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default QuizCategoriesList;