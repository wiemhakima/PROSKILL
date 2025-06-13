"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Play } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const quizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    questions: 15,
    duration: "10 min",
    difficulty: "Beginner",
    completed: true,
    score: 85,
  },
  {
    id: 2,
    title: "React Hooks Deep Dive",
    description: "Advanced concepts in React Hooks",
    questions: 20,
    duration: "15 min",
    difficulty: "Intermediate",
    completed: false,
  },
  {
    id: 3,
    title: "Node.js & Express",
    description: "Backend development with Node.js",
    questions: 18,
    duration: "12 min",
    difficulty: "Intermediate",
    completed: false,
  },
]

const sampleQuiz = {
  question: "What is the correct way to create a functional component in React?",
  options: [
    "function MyComponent() { return <div>Hello</div>; }",
    "const MyComponent = () => { return <div>Hello</div>; }",
    "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
    "Both A and B are correct",
  ],
  currentQuestion: 1,
  totalQuestions: 15,
}

export default function QuizzesPage() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">JavaScript Fundamentals Quiz</h1>
            <p className="text-slate-600">
              Question {sampleQuiz.currentQuestion} of {sampleQuiz.totalQuestions}
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowQuiz(false)}>
            Exit Quiz
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{sampleQuiz.question}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>8:45 remaining</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {sampleQuiz.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-slate-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button disabled={!selectedAnswer}>Next Question</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quizzes</h1>
        <p className="text-slate-600 mt-2">Test your knowledge and track your progress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </div>
                {quiz.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                  {quiz.completed && <span className="text-sm font-medium text-green-600">Score: {quiz.score}%</span>}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{quiz.questions} questions</span>
                  <span>⏱️ {quiz.duration}</span>
                </div>

                <Button
                  className="w-full"
                  variant={quiz.completed ? "outline" : "default"}
                  onClick={() => setShowQuiz(true)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
