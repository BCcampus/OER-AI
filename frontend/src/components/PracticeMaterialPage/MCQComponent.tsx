import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { MCQQuestion, QuestionAnswer } from "@/types/PracticeMaterial";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MCQQuestionComponentProps {
  question: MCQQuestion;
  questionNumber: number;
  answer: QuestionAnswer;
  onAnswerChange: (questionId: string, optionId: string) => void;
  onSubmit: (questionId: string) => void;
}

export function MCQQuestionComponent({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  onSubmit,
}: MCQQuestionComponentProps) {
  const handleOptionClick = (optionId: string) => {
    if (!answer.hasSubmitted) {
      onAnswerChange(question.id, optionId);
    }
  };

  const handleSubmit = () => {
    if (answer.selectedOption && !answer.hasSubmitted) {
      onSubmit(question.id);
    }
  };

  return (
    <Card className="space-y-4">
      <CardHeader>
        <h3 className="text-lg font-semibold mb-2">
          Question {questionNumber}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{question.questionText}</p>
      </CardHeader>

      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = answer.selectedOption === option.id;
          const isCorrect = option.id === question.correctAnswer;
          const showCorrect = answer.hasSubmitted && isCorrect;
          const showIncorrect = answer.hasSubmitted && isSelected && !isCorrect;

          return (
            <Button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={answer.hasSubmitted}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                "hover:border-gray-400 disabled:cursor-not-allowed",
                isSelected &&
                  !answer.hasSubmitted &&
                  "border-blue-500 bg-blue-50",
                !isSelected &&
                  !answer.hasSubmitted &&
                  "border-gray-200 bg-white",
                showCorrect && "border-green-500 bg-green-50",
                showIncorrect && "border-red-500 bg-red-50",
                !isSelected && answer.hasSubmitted && "opacity-60"
              )}
            >
              {/* options */}
              <div className="flex items-center justify-between">
                <span>
                  <span className="font-medium">
                    {option.id.toUpperCase()}.
                  </span>{" "}
                  {option.text}
                </span>
              </div>
            </Button>
          );
        })}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!answer.selectedOption || answer.hasSubmitted}
        className="w-full"
        variant={answer.hasSubmitted ? "secondary" : "default"}
      >
        {answer.hasSubmitted ? "Submitted" : "Submit Answer"}
      </Button>

      {/* explanation */}
      {answer.hasSubmitted && answer.isCorrect !== null && (
        <Card
          className={cn(
            "p-4",
            answer.isCorrect
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          )}
        >
          <div className="flex items-start gap-2">
            {answer.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-semibold mb-1">
                {answer.isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-gray-700">
                {
                  question.options.find(
                    (opt) => opt.id === answer.selectedOption
                  )?.explanation
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
}
