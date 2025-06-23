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

    const getIconColor = (score: number) => {
    if (score >= 80) return "text-green-200"
    if (score >= 60) return "text-yellow-200"
    return "text-red-200"
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-400/30"
    if (score >= 60) return "bg-amber-500/10 border-amber-400/30"
    return "bg-red-500/10 border-red-400/30"
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${getScoreBg(summary.overall_score)} border`}>
          <CardContent className="p-6 text-center">
            <Award className={`w-8 h-8 mx-auto mb-3 ${getIconColor(summary.overall_score)}`} />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(summary.overall_score)}`}>
              {summary.overall_score}%
            </div>
            <p className="text-slate-300 font-medium">Overall Match</p>
          </CardContent>
        </Card>

        <Card className={`${getScoreBg(skills_analysis.match_percent)} border`}>
          <CardContent className="p-6 text-center">
            <Target className={`w-8 h-8 mx-auto mb-3 ${getIconColor(skills_analysis.match_percent)}`} />
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(skills_analysis.match_percent)}`}>
              {skills_analysis.match_percent}%
            </div>
            <p className="text-slate-300 font-medium">Skills Match</p>
          </CardContent>
        </Card>

        <Card className={`${getScoreBg(summary.similarity_score)} border`}>
          <CardContent className="p-6 text-center">
            <Brain className={`w-8 h-8 mx-auto mb-3 ${getIconColor(summary.similarity_score)}`} />
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
        <Card className="bg-gradient-to-r from-blue-600/10 to-sky-600/20 border-blue-500/40">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-white font-bold">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              Skills Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Matched Skills */}
            <div>
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
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
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
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
        <Card className="bg-gradient-to-r from-purple-600/10 to-violet-600/20 border-purple-500/40">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-white">
              <FileText className="w-6 h-6 text-purple-400" />
              ATS Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Issues */}
            {ats_check.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
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
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
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
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
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
      <Card className="bg-gradient-to-r from-yellow-600/10 to-amber-600/20 border-yellow-500/40">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Brain className="w-6 h-6 text-yellow-200" />
            AI Review & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-yellow-300 leading-relaxed whitespace-pre-wrap">{reviewCVResponse.ai_review}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {ats_check.recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-600/10 to-green-600/20 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-white">
              <Lightbulb className="w-6 h-6 text-green-200" />
              Improvement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ats_check.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-emerald-600/20 rounded-lg border border-emerald-700">
                  <p className="text-green-300 text-sm leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
