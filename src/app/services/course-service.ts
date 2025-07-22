import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Config } from './config';
import { Asset, ProgramDetails, Topic } from '../interfaces/course-interface';

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
    const programDetails: ProgramDetails = {
      program_id: response.id,
      title: response.title,
      description: response.description,
      totalHours: response.duration_hours,
      skills: response.skills,
    };

    if (response.program && response.program.length > 0) {
      const program: Topic[] = response.program.map((item: any) => {
        const asset: Asset[] = item.asset.map((asset: any) => {
          return {
            asset_id: asset.asset_id,
            title: asset.title,
            description: asset.description,
          };
        });
        
        return {
          topic_id: item.topic_id,
          title: item.title,
          description: item.description,
          asset: asset,
        };
      });
      programDetails.programs = program;
    }

    this.programDetails.set(programDetails);
  }

  getProgramDetails() {
    return this.programDetails();
  }
}
