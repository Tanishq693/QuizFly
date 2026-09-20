export interface QuizOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  sourceQuote: string;
  quoteLocation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  sourceUrl: string;
  sourceDomain: string;
  category: string;
  timeAgo: string;
  avgScore: number;
  estMinutes: number;
  questions: Question[];
  createdAt: string;
}
