
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  MIXED = 'mixed'
}

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TrueFalse',
  SHORT_ANSWER = 'ShortAnswer'
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  courseLevel: string;
  difficulty: Difficulty;
  lectureText: string;
  questions: Question[];
  createdAt: number;
}

export interface QuizAttempt {
  quizId: string;
  answers: Record<string, string>;
  score: number;
  completedAt: number;
}
