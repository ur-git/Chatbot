import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Config {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http.get(environment.configFile).pipe(
      tap((config) => (this.config = config)),
      catchError((error) => {
        console.error('Error loading config file:', error);
        this.config = this.getFallbackConfig();
        return of(this.config);
      })
    );
  }

  private getFallbackConfig() {
    return {
      apiEndpoints: {
        apiBaseUrl: '',
        chat: '/api/chat',
        clearhistory: '/api/clear_history',
        getChatHistory: '/api/history',
        programDetails: '/api/program',
        generateProgram: '/api/program-status',
      },
      application: {
        name: 'Course Program Generator Bot',
        version: '1.0.0',
        logo: 'assets/images/logo.png',
        description:
          "Hey! I'm your AI assistant here to generate a personalized program for you.",
        supportEmail: 'support@yourcompany.com',
        requestTimeout: 10000,
      },
      userSettings: {
        defaultLanguage: 'en',
        maxChatHistory: 50,
        autoSuggestCourses: true,
        notificationsEnabled: true,
      },
    };
  }

  get apiBaseUrl() {
    if (this.config.apiEndpoints.apiBaseUrl !== '') {
      return this.config.apiEndpoints.apiBaseUrl;
    }
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  }

  get appInfo() {
    return this.config.application;
  }

  get userInfo() {
    return this.config.userSettings;
  }

  getApiEndpoint(endpoint: string) {
    return this.config.apiEndpoints[endpoint];
  }
}
