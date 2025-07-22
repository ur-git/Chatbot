import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ProgramDetails } from '../../interfaces/course-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzListModule } from 'ng-zorro-antd/list';
import { CourseService } from '../../services/course-service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

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
    NzSkeletonModule,
  ],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private message = inject(NzMessageService);
  program: any | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      this.program = this.courseService.getProgramDetails();
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['courseId']) {
          this.loadProgramDetails(params['courseId']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProgramDetails(courseId: string): void {
    this.isLoading = true;
    this.courseService
      .getProgramDetailsApi(courseId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.status === 200) {
            this.courseService.addProgramDetails(response);
          } else {
            this.message.error('Failed to load course details');
            this.router.navigate(['/']);
          }
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
    if (this.program) {
      this.message.success(`Successfully enrolled in ${this.program.title}!`);
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
