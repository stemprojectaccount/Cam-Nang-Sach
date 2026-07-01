export interface Book {
  id: string;
  title: string;
  author: string;
  cat: string;
  desc?: string;
  pdfUrl?: string;
  content?: string;
  age?: string; // e.g. "5-7", "8-10", "11-15"
}

export interface UserStats {
  minutes: number;
  books: number;
}
