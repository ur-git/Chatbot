import { inject, Injectable, signal } from '@angular/core';
import { ChatMessage } from '../interfaces/chat-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import { Storage } from './storage';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private configService = inject(Config);
  private storageService = inject(Storage);
  private message = inject(NzMessageService);
  private chatMessages = signal<ChatMessage[]>([]);

  constructor() {
    // Initialize chat messages from storage
    this.chatMessages.set(this.storageService.getItem('chatMessages') || []);
  }

  /**
   * Service function to generate unique id for chat message
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Service function to send message to server
   */
  sendMessage(message: string) {
    const newMessage: ChatMessage = {
      id: this.generateId(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
    this.addMessage(newMessage);

    return this.sendMessageToServer(message);
  }

  /**
   * Service function to send message to server
   */
  sendMessageToServer(message: string) {
    const chatEndpoint = this.configService.getApiEndpoint('chat');
    const URL = `${this.configService.apiBaseUrl}${chatEndpoint}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      query: message,
    };
    const options = { headers };

    return this.http.post(URL, body, options);
  }

  /**
   * Service function to add bot response to chat messages
   */
  addBotResponse(response: any): void {
    const botMessage: ChatMessage = {
      id: response.id || this.generateId(),
      content: response.message,
      type: response.type,
      sender: 'bot',
      timestamp: new Date(),
      programs: response.suggestedPrograms,
    };

    this.addMessage(botMessage);
  }

  /**
   * Service function to add message to chat messages
   */
  addMessage(message: ChatMessage) {
    this.chatMessages.update((messages) => [...messages, message]);
    this.storageService.setItem('chatMessages', this.chatMessages());
  }

  /**
   * Service function to get chat messages
   */
  getMessages() {
    return this.chatMessages();
  }

  /**
   * Service function to clear chat
   */
  clearChatApi() {
    const chatEndpoint = this.configService.getApiEndpoint('clearhistory');
    const URL = `${this.configService.apiBaseUrl}${chatEndpoint}`;
    return this.http.post(URL, {});
  }

  clearChat() {
    this.chatMessages.set([]);
    this.storageService.clear();
  }
}
