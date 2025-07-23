import { Component, inject, Input } from '@angular/core';
import { Program, ProgramDetails } from '../../interfaces/course-interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-course-card',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzGridModule,
    NzIconModule,
    NzBadgeModule,
  ],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  @Input() program!: Program;
  @Input() compact: boolean = false;
  private router = inject(Router);

  ngOnInit() {}

  /**
   * Navigate to the course detail page
   */
  navigateToCourse() {
    this.router.navigate(['/program', this.program.id]);
  }

  /**
   * Get a random color for the course card to show in the tag
   * @returns string
   */
  getRandomColor(): string {
    const colors = [
      'pink',
      'red',
      'yellow',
      'orange',
      'cyan',
      'green',
      'blue',
      'purple',
      'geekblue',
      'magenta',
      'volcano',
      'gold',
      'lime',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
