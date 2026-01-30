
import React from 'react';
import { Quiz } from '../types';
import { GraduationCap, ArrowRight, Clock, BarChart } from 'lucide-react';

interface StudentPortalProps {
  quizzes: Quiz[];
  onStartQuiz: (quiz: Quiz) => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ quizzes, onStartQuiz }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2">
        <GraduationCap className="w-12 h-12 text-indigo-600 mx-auto" />
        <h1 className="text-3xl font-bold text-slate-900">Student Portal</h1>
        <p className="text-slate-500">Select an assessment to test your knowledge</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No assessments are currently available. Check back later!</p>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div 
              key={quiz.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer"
              onClick={() => onStartQuiz(quiz)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  quiz.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {quiz.difficulty}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  {quiz.questions.length} Questions
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {quiz.title}
              </h3>
              
              <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                <span className="flex items-center gap-1">
                  <BarChart className="w-4 h-4" /> {quiz.courseLevel} Level
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> ~{quiz.questions.length * 2} mins
                </span>
              </div>
              
              <button 
                className="w-full py-3 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Start Assessment <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
