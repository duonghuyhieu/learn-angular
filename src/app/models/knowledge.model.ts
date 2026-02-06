export interface Lesson {
  id: string;
  title: string;
  category: string;
  icon: string;
  sections: LessonSection[];
}

export interface LessonSection {
  title: string;
  content: string;
  code?: CodeExample;
  tips?: string[];
}

export interface CodeExample {
  language: string;
  code: string;
  filename?: string;
}
