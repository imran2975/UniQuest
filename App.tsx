
import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import StudentPortal from './components/StudentPortal';
import QuizPlayer from './components/QuizPlayer';
import { Quiz } from './types';
import { Users, ShieldCheck, Github } from 'lucide-react';

type UserRole = 'ADMIN' | 'STUDENT';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('uniquest_quizzes');
    if (saved) {
      try {
        setQuizzes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved quizzes", e);
      }
    }
  }, []);

  const saveQuizzes = (updatedQuizzes: Quiz[]) => {
    setQuizzes(updatedQuizzes);
    localStorage.setItem('uniquest_quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleQuizGenerated = (quiz: Quiz) => {
    saveQuizzes([quiz, ...quizzes]);
  };

  const handleDeleteQuiz = (id: string) => {
    saveQuizzes(quizzes.filter(q => q.id !== id));
  };

  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <QuizPlayer quiz={activeQuiz} onExit={() => setActiveQuiz(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">U</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                UniQuest
              </span>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setRole('STUDENT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  role === 'STUDENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users className="w-4 h-4" /> Student
              </button>
              <button
                onClick={() => setRole('ADMIN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  role === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-6 sm:py-12">
        {role === 'ADMIN' ? (
          <AdminDashboard 
            onQuizGenerated={handleQuizGenerated} 
            quizzes={quizzes}
            onDeleteQuiz={handleDeleteQuiz}
          />
        ) : (
          <StudentPortal 
            quizzes={quizzes} 
            onStartQuiz={(quiz) => setActiveQuiz(quiz)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            Powered by Gemini 3 Flash • Built for Academia
          </p>
          <div className="mt-4 flex justify-center gap-4 text-slate-300">
             <Github className="w-5 h-5 cursor-pointer hover:text-slate-500 transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
