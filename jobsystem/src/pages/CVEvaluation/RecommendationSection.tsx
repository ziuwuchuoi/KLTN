import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Code, ArrowRight, Star, Clock, TrendingUp } from "lucide-react"
import type { EvaluatedCVDetail } from "@/services/file.service"

interface RecommendationsSectionProps {
  evaluationResult: EvaluatedCVDetail
}

export function RecommendationsSection({ evaluationResult }: RecommendationsSectionProps) {
  const { skills_analysis } = evaluationResult.reviewCVResponse

  // Mock quiz recommendations based on missing skills
  const quizRecommendations = skills_analysis.missing_skills.slice(0, 6).map((skill, index) => ({
    id: `quiz-${index}`,
    title: `${skill} Fundamentals Quiz`,
    description: `Test your knowledge of ${skill} concepts and best practices`,
    difficulty: ["Beginner", "Intermediate", "Advanced"][index % 3],
    questions: Math.floor(Math.random() * 20) + 10,
    estimatedTime: `${Math.floor(Math.random() * 30) + 15} min`,
    category: skill,
    rating: (Math.random() * 2 + 3).toFixed(1),
  }))

  // Mock coding problem recommendations
  const codingRecommendations = skills_analysis.missing_skills.slice(0, 6).map((skill, index) => ({
    id: `problem-${index}`,
    title: `${skill} Implementation Challenge`,
    description: `Solve real-world problems using ${skill}`,
    difficulty: ["Easy", "Medium", "Hard"][index % 3],
    acceptance: `${Math.floor(Math.random() * 40) + 40}%`,
    category: skill,
    tags: [skill, "Algorithm", "Problem Solving"],
    companies: ["Google", "Microsoft", "Amazon", "Meta"].slice(0, Math.floor(Math.random() * 3) + 1),
  }))

  const difficultyColors = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <div className="space-y-12 mt-16">
      {/* Section Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full mb-4">
          <TrendingUp className="w-4 h-4" />
          Personalized Learning Path
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Recommended for You</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Based on your CV analysis, here are targeted quizzes and coding challenges to help you improve your skills.
        </p>
      </div>

      {/* Quiz Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Knowledge Quizzes</h3>
            <p className="text-slate-400">Test and improve your theoretical understanding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizRecommendations.map((quiz) => (
            <Card key={quiz.id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={difficultyColors[quiz.difficulty as keyof typeof difficultyColors]}>
                    {quiz.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs">{quiz.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg text-white">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm">{quiz.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {quiz.questions} questions
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {quiz.estimatedTime}
                  </div>
                </div>

                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  {quiz.category}
                </Badge>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coding Problems */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Coding Challenges</h3>
            <p className="text-slate-400">Practice with real-world programming problems</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codingRecommendations.map((problem) => (
            <Card
              key={problem.id}
              className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={difficultyColors[problem.difficulty as keyof typeof difficultyColors]}>
                    {problem.difficulty}
                  </Badge>
                  <div className="text-xs text-slate-400">{problem.acceptance} acceptance</div>
                </div>
                <CardTitle className="text-lg text-white">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm">{problem.description}</p>

                <div className="flex flex-wrap gap-1">
                  {problem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Asked by:</p>
                  <div className="flex flex-wrap gap-1">
                    {problem.companies.map((company, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Solve Problem
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Level Up?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Start with the recommended quizzes and coding challenges to improve your skills and increase your job match
            score.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600">
              <Code className="w-5 h-5 mr-2" />
              Practice Coding
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
