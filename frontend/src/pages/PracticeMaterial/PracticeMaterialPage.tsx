import { useState } from 'react';
import { GenerateForm } from '@/components/PracticeMaterialPage/GenerateForm';
import { MCQQuestionComponent } from '@/components/PracticeMaterialPage/MCQComponent';
import type { MCQQuestion, QuestionAnswer } from '@/types/PracticeMaterial';

// Dummy MCQ data
const dummyMCQs: MCQQuestion[] = [
  {
    id: '1',
    questionText: 'What is the derivative of x²?',
    options: [
      { id: 'a', text: 'x', explanation: 'Incorrect. The derivative of x² is 2x, not x.' },
      { id: 'b', text: '2x', explanation: 'Correct! Using the power rule, d/dx(x²) = 2x.' },
      { id: 'c', text: 'x²', explanation: 'Incorrect. This is the original function, not its derivative.' },
      { id: 'd', text: '2', explanation: 'Incorrect. This would be the derivative of 2x, not x².' }
    ],
    correctAnswer: 'b'
  },
  {
    id: '2',
    questionText: 'What is the integral of 2x?',
    options: [
      { id: 'a', text: 'x² + C', explanation: 'Correct! The integral of 2x is x² + C.' },
      { id: 'b', text: '2x² + C', explanation: 'Incorrect. This would be the integral of 4x.' },
      { id: 'c', text: 'x + C', explanation: 'Incorrect. This would be the integral of 1.' },
      { id: 'd', text: '2 + C', explanation: 'Incorrect. This would be the integral of a constant.' }
    ],
    correctAnswer: 'a'
  }
];

export default function PracticeMaterialPage() {
  const [answers, setAnswers] = useState<QuestionAnswer[]>(
    dummyMCQs.map(q => ({
      questionId: q.id,
      selectedOption: null,
      isCorrect: null,
      hasSubmitted: false
    }))
  );

  const handleGenerate = (formData: any) => {
    console.log('Generate form data:', formData);
  };

//   set the answer for that question to be the selected option id
  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => prev.map(answer => 
      answer.questionId === questionId 
        ? { ...answer, selectedOption: optionId }
        : answer
    ));
  };

  const handleSubmit = (questionId: string) => {
    const question = dummyMCQs.find(q => q.id === questionId);
    if (!question) return;

    setAnswers(prev => prev.map(answer => 
      answer.questionId === questionId 
        ? { 
            ...answer, 
            hasSubmitted: true,
            isCorrect: answer.selectedOption === question.correctAnswer
          }
        : answer
    ));
  };

  const handleReset = (questionId: string) => {
    setAnswers(prev => prev.map(answer => 
      answer.questionId === questionId 
        ? {
            ...answer,
            selectedOption: null,
            isCorrect: null,
            hasSubmitted: false
          }
        : answer
    ));
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-6">

        <div className="w-full md:w-[30%]">
          <GenerateForm onGenerate={handleGenerate} />
        </div>

        <div className="w-full md:w-[70%] space-y-6">
          <h2 className="text-2xl font-semibold">Practice Questions</h2>
          {dummyMCQs.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.id)!;
            return (
              <MCQQuestionComponent
                key={question.id}
                question={question}
                questionNumber={index + 1}
                answer={answer}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}