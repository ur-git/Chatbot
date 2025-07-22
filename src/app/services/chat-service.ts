import { inject, Injectable, signal } from '@angular/core';
import { ChatMessage } from '../interfaces/chat-interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    const chatMessages = this.storageService.getItem('chatMessages');
    if (chatMessages) {
      this.chatMessages.set(chatMessages);
    } else {
      this.initializeChat();
    }
  }

  initializeChat() {
    const chatMessage: ChatMessage = {
      id: this.generateId(),
      content:
        "Hey! I'm your AI assistant here to generate a personalized program for you.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    };
    this.addMessage(chatMessage);
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
    this.addTypingResponse();

    const chatEndpoint = this.configService.getApiEndpoint('chat');
    const URL = `${this.configService.apiBaseUrl}${chatEndpoint}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let body: any = {
      query: message,
    };

    if (this.storageService.getItem('sessionId')) {
      body.session_id = this.storageService.getItem('sessionId');
    }

    const options = { headers };

    return this.http.post(URL, body, options);
  }

  addTypingResponse() {
    const typingMessage: ChatMessage = {
      id: this.generateId(),
      content: 'Thinking...',
      sender: 'typing',
      timestamp: new Date(),
      type: 'text',
    };

    this.addMessage(typingMessage);
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
    this.chatMessages.update((messages) => [
      ...messages.filter((msg) => msg.sender !== 'typing'),
      botMessage,
    ]);
    this.storageService.setItem('chatMessages', this.chatMessages());
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
    const sessionId = this.storageService.getItem('sessionId');
    const URL = `${this.configService.apiBaseUrl}${chatEndpoint}/${sessionId}`;
    return this.http.post(URL, {});
  }

  clearChat() {
    this.chatMessages.set([]);
    this.storageService.clear();
    this.initializeChat();
  }
}
