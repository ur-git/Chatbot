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
        baseUrl: '',
        chat: '/chat',
        chatdelete: '/chatdelete',
        courseDetails: '/courseDetails',
        user: '/user',
      },
      features: {
        enableLogging: true,
        enableAnalytics: false,
        debugMode: true,
      },
      ui: {
        theme: 'light',
        chatRefreshInterval: 1000,
      },
      application: {
        name: 'ChatBot Learning Platform',
        version: '1.0.0',
        description: 'AI-powered course recommendation chatbot',
        supportEmail: 'support@yourcompany.com',
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
    if(this.config.apiEndpoints.apiBaseUrl !== ''){
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
