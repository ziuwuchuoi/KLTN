import React from "react";
import { Button } from "@/components/ui/button";

interface FeaturedQuizSectionProps {
  onStart: () => void;
}

const FeaturedQuiz = ({ onStart }: FeaturedQuizSectionProps) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 flex items-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">
          Featured Assessment
        </span>
        <span className="ml-3 px-3 py-1 bg-indigo-900/30 text-indigo-400 text-xs rounded-full">NEW</span>
      </h2>
      
      <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-indigo-500 transition-all duration-300 bg-gradient-to-br from-zinc-900 to-zinc-950 group cursor-pointer">
        <div className="relative h-48 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-3xl font-bold text-white">Full Stack Developer Assessment</h3>
          </div>
        </div>
        
        <div className="p-8">
          <p className="text-gray-300 mb-6">
            Comprehensive evaluation of your front-end, back-end, database, and system design skills for senior developer positions
          </p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <SkillTag name="React" color="blue" />
            <SkillTag name="Node.js" color="green" />
            <SkillTag name="SQL" color="yellow" />
            <SkillTag name="System Design" color="purple" />
            <SkillTag name="Algorithm" color="red" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <QuizBadge letter="JS" color="from-blue-500 to-blue-700" />
                <QuizBadge letter="DB" color="from-green-500 to-green-700" />
                <QuizBadge letter="API" color="from-purple-500 to-purple-700" />
              </div>
              <span className="ml-3 text-sm text-gray-500">45 questions • 90 minutes</span>
            </div>
            
            <Button 
              onClick={onStart}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SkillTagProps {
  name: string;
  color: string;
}

const SkillTag = ({ name, color }: SkillTagProps) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-900/20 text-blue-400",
    green: "bg-green-900/20 text-green-400",
    yellow: "bg-yellow-900/20 text-yellow-400",
    purple: "bg-purple-900/20 text-purple-400",
    red: "bg-red-900/20 text-red-400"
  };
  
  return (
    <span className={`px-3 py-1 ${colorMap[color]} rounded-full text-sm`}>
      {name}
    </span>
  );
};

interface QuizBadgeProps {
  letter: string;
  color: string;
}

const QuizBadge = ({ letter, color }: QuizBadgeProps) => {
  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold`}>
      {letter}
    </div>
  );
};

export default FeaturedQuiz;