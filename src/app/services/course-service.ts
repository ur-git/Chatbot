import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Course, CourseDetails } from '../interfaces/course-interface';
import { Observable } from 'rxjs';
import { Config } from './config';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private configService = inject(Config);
  constructor() {}

  getCourseDetails(courseId: string): Observable<CourseDetails> {
    const endpoint = this.configService.getApiEndpoint('courseDetailsEndpoint');
    const url = endpoint.replace('{id}', courseId);
    return this.http.get<CourseDetails>(url);
  }

  searchCourses(query: string): Observable<Course[]> {
    const endpoint = this.configService.getApiEndpoint('coursesEndpoint');
    return this.http.get<Course[]>(`${endpoint}?search=${query}`);
  }

  getAllCourses(): Observable<Course[]> {
    const endpoint = this.configService.getApiEndpoint('coursesEndpoint');
    return this.http.get<Course[]>(endpoint);
  }
}
