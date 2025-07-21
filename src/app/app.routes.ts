import { Routes } from '@angular/router';
import { Chatbot } from './chatbot/chatbot';
import { CourseDetail } from './course/course-detail/course-detail';

export const routes: Routes = [
    { path: '', component: Chatbot },
    { path: 'chat', component: Chatbot },
    { path: 'course/:id', component: CourseDetail },
    { path: '**', redirectTo: '' }
];
