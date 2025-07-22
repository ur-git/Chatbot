export interface Program   {
  id: string;
  description: string;
  totalHours: number;
  skills: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
}

export interface ProgramDetails extends Program {
  title: string;
  tags: string[];
  courses: Course[];
}


