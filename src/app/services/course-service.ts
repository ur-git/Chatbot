import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private configService = inject(Config);
  private programDetails = signal<any>(null);
  constructor() {}

  getProgramDetailsApi(courseId: string) {
    const endpoint = this.configService.getApiEndpoint('courseDetails');
    const URL = `${this.configService.apiBaseUrl}${endpoint}`;

    const params = new HttpParams().append('courseId', courseId);

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });
    const options = { params };

    return this.http.get(URL, options);
  }

  addProgramDetails(response: any) {
    const programDetails: any = {
      id: response.id,
      title: response.title,
      description: response.description,
      totalHours: response.duration_hours,
      skills: response.skills_covered,
      courses: response.courses || [],
    };
    this.programDetails.set(programDetails);
  }

  getProgramDetails() {
    return this.programDetails();
  }
}
