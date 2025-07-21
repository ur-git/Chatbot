export interface Course {
  id: string;
  title: string;
  description: string;
  rating: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  tags: string[];
  enrolledStudents: number;
}

export interface CourseDetails extends Course {
  fullDescription: string;
  syllabus: CourseSyllabus[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  instructorBio: string;
  reviews: CourseReview[];
}

export interface CourseSyllabus {
  module: string;
  topics: string[];
  duration: string;
}

export interface CourseReview {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: Date;
}
