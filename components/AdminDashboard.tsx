
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { Difficulty, QuestionType, Quiz } from '../types';
import { Loader2, Plus, BookOpen, Trash2, Edit3 } from 'lucide-react';

interface AdminDashboardProps {
  onQuizGenerated: (quiz: Quiz) => void;
  quizzes: Quiz[];
  onDeleteQuiz: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onQuizGenerated, quizzes, onDeleteQuiz }) => {
  const [lectureText, setLectureText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [courseLevel, setCourseLevel] = useState('200');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([QuestionType.MCQ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeToggle = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleGenerate = async () => {
    if (!lectureText.trim()) {
      setError("Please provide lecture notes.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const result = await generateQuiz(lectureText, numQuestions, difficulty, selectedTypes, courseLevel);
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: result.title || "Untitled Quiz",
        lectureText,
        courseLevel,
        difficulty,
        questions: result.questions || [],
        createdAt: Date.now()
      };
      onQuizGenerated(newQuiz);
      setLectureText('');
    } catch (err: any) {
      setError(err.message || "Failed to generate quiz.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
          <p className="text-slate-500">Create and manage academic assessments</p>
        </div>
        <BookOpen className="w-10 h-10 text-indigo-600" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Generator Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" /> New Assessment
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lecture Material</label>
                <textarea
                  className="w-full h-48 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Paste lecture notes, slides, or textbook excerpts here..."
                  value={lectureText}
                  onChange={(e) => setLectureText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Questions Count</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course Level</label>
                  <select
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                  >
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level (Masters)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                <div className="flex gap-2">
                  {Object.values(Difficulty).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                        difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question Types</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(QuestionType).map(t => (
                    <button
                      key={t}
                      onClick={() => handleTypeToggle(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedTypes.includes(t) ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                      } border`}
                    >
                      <input type="checkbox" readOnly checked={selectedTypes.includes(t)} className="rounded" />
                      {t.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">{error}</p>}

              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
                {isGenerating ? 'Generating Assessment...' : 'Generate Quiz'}
              </button>
            </div>
          </div>
        </div>

        {/* Quiz List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Active Quizzes ({quizzes.length})
          </h2>
          <div className="space-y-3">
            {quizzes.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm">
                No quizzes generated yet.
              </div>
            ) : (
              quizzes.map(quiz => (
                <div key={quiz.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-800 line-clamp-1">{quiz.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{quiz.courseLevel} Level • {quiz.difficulty}</p>
                    </div>
                    <button
                      onClick={() => onDeleteQuiz(quiz.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
