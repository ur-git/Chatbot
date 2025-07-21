import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CourseDetails } from '../../interfaces/course-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzListModule } from 'ng-zorro-antd/list';
import { CourseService } from '../../services/course-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-course-detail',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzSpinModule,
    NzAvatarModule,
    NzTabsModule,
    NzButtonModule,
    NzRateModule,
    NzTagModule,
    NzStepsModule,
    NzListModule,
  ],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private message = inject(NzMessageService);
  course: CourseDetails | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.loadCourseDetails(params['id']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCourseDetails(courseId: string): void {
    this.isLoading = true;
    // this.course = {
    //   id: '1',
    //   title: 'Course 1',
    //   description: 'Description 1',
    //   instructor: 'Instructor 1',
    //   duration: '1 hour',
    //   level: 'Beginner',
    //   rating: 4.5,
    //   price: 100,
    //   category: 'Category 1',
    //   thumbnail: 'https://via.placeholder.com/150',
    //   tags: ['Tag 1', 'Tag 2'],
    //   enrolledStudents: 100,
    //   fullDescription: 'Full description 1',
    //   syllabus: [],
    //   prerequisites: [],
    //   whatYouWillLearn: [],
    //   instructorBio: 'Instructor bio 1',
    //   reviews: [],
    // };
    this.courseService.getCourseDetails(courseId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (course) => {
        this.course = course;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading course details:', error);
        this.message.error('Failed to load course details');
        this.router.navigate(['/']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  enrollInCourse(): void {
    if (this.course) {
      this.message.success(`Successfully enrolled in ${this.course.title}!`);
      // Here you would typically call an enrollment API
    }
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Advanced':
        return 'red';
      default:
        return 'blue';
    }
  }
}
