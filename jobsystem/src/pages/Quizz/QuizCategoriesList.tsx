"use client"
import { useNavigate } from "react-router-dom"
import { QuizCategoryCard} from "./QuizCategoryCard"
import { quizCategories } from "./documents"

const QuizCategoriesList = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-8xl max-h-2xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
        {quizCategories.map((item) => (
          <QuizCategoryCard
            key={item._id}
            item={item}
            onStartClick={() => navigate(item.route)}
            requiredConfirm={false}
          />
        ))}
      </div>
    </div>
  )
}

export default QuizCategoriesList
