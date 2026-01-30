
import React, { useState } from 'react';
import { Quiz, QuestionType } from '../types';
// Fix: Added BarChart to the imports from lucide-react
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, RefreshCcw, Home, BarChart } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onExit: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentIdx + 1) / totalQuestions) * 100;

  const handleAnswer = (answer: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsSubmitted(true);
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()) {
        score++;
      }
    });
    return score;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-12">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 ${
            percentage >= 70 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
          }`}>
            {percentage >= 70 ? <CheckCircle2 className="w-12 h-12" /> : <BarChart className="w-12 h-12" />}
          </div>
          <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
          <p className="text-slate-500 mb-8">Great job on finishing {quiz.title}</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="block text-2xl font-bold text-slate-900">{score}/{totalQuestions}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Correct</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="block text-2xl font-bold text-slate-900">{percentage}%</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Score</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setShowResults(false);
                setIsSubmitted(false);
                setUserAnswers({});
                setCurrentIdx(0);
              }}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" /> Retake Assessment
            </button>
            <button 
              onClick={onExit}
              className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-12 space-y-6">
          <h3 className="text-xl font-bold">Review Answers</h3>
          {quiz.questions.map((q, idx) => {
            const isCorrect = userAnswers[q.id]?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim();
            return (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <span className="font-bold text-slate-400">Q{idx + 1}</span>
                  {isCorrect ? 
                    <span className="flex items-center gap-1 text-green-600 text-sm font-bold"><CheckCircle2 className="w-4 h-4" /> Correct</span> :
                    <span className="flex items-center gap-1 text-red-600 text-sm font-bold"><XCircle className="w-4 h-4" /> Incorrect</span>
                  }
                </div>
                <p className="text-slate-800 font-medium mb-4">{q.question}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="text-slate-500">Your Answer:</span> <span className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{userAnswers[q.id] || '(Skipped)'}</span></p>
                  {!isCorrect && <p className="text-sm"><span className="text-slate-500">Correct Answer:</span> <span className="text-green-700 font-semibold">{q.correct_answer}</span></p>}
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Explanation</p>
                  <p className="text-sm text-indigo-800">{q.explanation}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="text-right">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{quiz.title}</span>
          <p className="text-slate-400 text-xs">Question {currentIdx + 1} of {totalQuestions}</p>
        </div>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">{currentQuestion.question}</h2>

        <div className="space-y-4">
          {currentQuestion.type === QuestionType.MCQ || currentQuestion.type === QuestionType.TRUE_FALSE ? (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>{option}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
              placeholder="Type your answer based on the lecture notes..."
              value={userAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
        >
          {currentIdx === totalQuestions - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;
