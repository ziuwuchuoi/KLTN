import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, CheckCircle, AlertTriangle, Brain, FileText, Award, Lightbulb } from "lucide-react"
import type { EvaluatedCVDetail } from "@/services/file.service"

interface EvaluationResultsProps {
  result: EvaluatedCVDetail
}

export function EvaluationResults({ result }: EvaluationResultsProps) {
  const { reviewCVResponse } = result
  const { summary, skills_analysis, ats_check } = reviewCVResponse

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-600/20 border-green-500/30"
    if (score >= 60) return "bg-yellow-600/20 border-yellow-500/30"
    return "bg-red-600/20 border-red-500/30"
  }

  const getFitLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "excellent":
        return "text-green-400"
      case "good":
        return "text-blue-400"
      case "fair":
        return "text-yellow-400"
      default:
        return "text-red-400"
    }
  }

  return (
    <div className="space-y-8">
      {/* Overall Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${getScoreBg(summary.overall_score)} border`}>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-3 text-current" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(summary.overall_score)}`}>
              {summary.overall_score}%
            </div>
            <p className="text-slate-300 font-medium">Overall Match</p>
          </CardContent>
        </Card>

        <Card className={`${getScoreBg(skills_analysis.match_percent)} border`}>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-3 text-current" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(skills_analysis.match_percent)}`}>
              {skills_analysis.match_percent}%
            </div>
            <p className="text-slate-300 font-medium">Skills Match</p>
          </CardContent>
        </Card>

        <Card className={`${getScoreBg(summary.similarity_score)} border`}>
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 mx-auto mb-3 text-current" />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(summary.similarity_score)}`}>
              {summary.similarity_score}%
            </div>
            <p className="text-slate-300 font-medium">Content Similarity</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Skills Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fit Level */}
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">Candidate Fit Level</p>
              <p className={`text-2xl font-bold ${getFitLevelColor(summary.fit_level)}`}>
                {summary.fit_level.toUpperCase()}
              </p>
            </div>

            {/* Matched Skills */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Matched Skills ({skills_analysis.matched_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills_analysis.matched_skills.map((skill, index) => (
                  <Badge key={index} className="bg-green-600/20 text-green-400 border-green-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Missing Skills ({skills_analysis.missing_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills_analysis.missing_skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-yellow-500/30 text-yellow-400">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ATS Check */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5 text-purple-400" />
              ATS Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Issues */}
            {ats_check.issues.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Issues Found
                </h4>
                <div className="space-y-2">
                  {ats_check.issues.map((issue, index) => (
                    <div key={index} className="p-3 bg-red-600/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-300 text-sm">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {ats_check.missing_keywords.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ats_check.missing_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="border-orange-500/30 text-orange-400">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Formatting Tips */}
            {ats_check.formatting_tips.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-400" />
                  Formatting Tips
                </h4>
                <div className="space-y-2">
                  {ats_check.formatting_tips.map((tip, index) => (
                    <div key={index} className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-300 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Review */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-green-400" />
            AI Review & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{reviewCVResponse.ai_review}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {ats_check.recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lightbulb className="w-5 h-5 text-purple-400" />
              Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ats_check.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-slate-300 text-sm leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
