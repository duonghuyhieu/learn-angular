export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'basics' | 'components' | 'directives' | 'services' | 'routing' | 'forms' | 'rxjs' | 'lifecycle' | 'signals';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  answeredQuestions: AnsweredQuestion[];
  isFinished: boolean;
}

export interface AnsweredQuestion {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}
