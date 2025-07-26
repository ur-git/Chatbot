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
import { finalize, Subject, takeUntil, timeout } from 'rxjs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { Storage } from '../../services/storage';
import { Config } from '../../services/config';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

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
    NzCollapseModule,
    NzIconModule,
    NzToolTipModule
  ],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private message = inject(NzMessageService);
  private storageService = inject(Storage);
  private configService = inject(Config);
  program: ProgramDetails | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();
  appInfo: any = null;
  constructor() {
    effect(() => {
      this.program = this.courseService.getProgramDetails();
    });
  }

  ngOnInit(): void {
    this.appInfo = this.configService.appInfo;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.loadProgramDetails(params['id']);
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
        timeout(this.appInfo.requestTimeout),
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response) {
            const response_data = response.data;
            this.courseService.addProgramDetails(response_data);
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

  /**
   * Download the program as a JSON file
   */
  downloadProgram(): void {
    const jsonData = JSON.stringify(this.program);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.program?.title}.json`;
    a.click();
  }
}
