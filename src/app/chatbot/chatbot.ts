import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { finalize, tap } from 'rxjs';
import { ChatMessage, carouselOptions } from '../interfaces/chat-interface';
import { ChatService } from '../services/chat-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CourseCard } from '../course/course-card/course-card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Config } from '../services/config';
import { Storage } from '../services/storage';

@Component({
  selector: 'app-chatbot',
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzInputModule,
    NzLayoutModule,
    NzSpinModule,
    NzDividerModule,
    NzAvatarModule,
    NzDatePickerModule,
    CourseCard,
    NzGridModule,
    NzCollapseModule,
    CarouselModule,
    NzToolTipModule,
    NzModalModule,
  ],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class Chatbot {
  carouselOptions = carouselOptions;
  @ViewChild('myTextarea') myTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  private chatService = inject(ChatService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private configService = inject(Config);
  private storageService = inject(Storage);
  chatMessages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  private shouldScrollToBottom = false;
  isVisible = false;
  isOkLoading = false;
  appInfo: any = null;

  constructor() {
    effect(
      () => {
        this.chatMessages = this.chatService.getMessages();
        this.shouldScrollToBottom = true;
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    // Get application information from config
    this.appInfo = this.configService.appInfo;
  }

  ngAfterViewChecked(): void {
    // Scroll to bottom of chat container when new message is added
    if (this.shouldScrollToBottom && this.chatMessages.length > 0) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * Function to clear chat history
   */
  clearChat() {
    this.modal.warning({
      nzTitle: 'Delete Chat?',
      nzContent: 'This will delete all your chat history.',
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOkLoading: this.isOkLoading,
      nzOnOk: () => {
        this.isOkLoading = true;
        this.chatService.clearChatApi().subscribe({
          next: (res: any) => {
            if (res) {
              this.isOkLoading = false;
              this.chatService.clearChat();
            }
          },
          error: (err: any) => {
            console.error('Error clearing chat:', err);
            this.message.error('Error clearing chat');
            this.isOkLoading = false;
          },
        });
      },
    });
  }

  /**
   * Function to send user message
   */
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();

      this.myTextarea?.nativeElement.focus();
    }
  }

  /**
   * Function to send user message to bot and get response from bot
   */
  sendMessage() {
    this.isLoading = true;
    const messageContent = this.currentMessage.trim();
    this.currentMessage = '';

    if (messageContent) {
      this.chatService
        .sendMessage(messageContent)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.setBotResponse(response);
            }
          },
          error: (error) => {
            console.error('Error sending message:', error);
            this.message.error('Failed to send message. Please try again.');

            this.chatService.addBotResponse({
              message: 'Sorry, I encountered an error. Please try again.',
              suggestedPrograms: [],
            });
          },
        });
    }
  }

  setBotResponse(response: any) {
    let botResponse = {};
    const responseType = response.type;
    const responseData = response.data;
    const sessionId = response.session_id;
    this.storageService.setItem('sessionId', sessionId);
    if (responseType === 'basic') {
      botResponse = {
        id: responseData.id,
        type: responseType,
        message: responseData.message,
      };
    } else if (responseType === 'program') {
      botResponse = {
        id: responseData.id,
        type: responseType,
        message:
          responseData.message ||
          'Here are some programs that might interest you!',
        suggestedPrograms: responseData.program || [],
      };
    }

    this.chatService.addBotResponse(botResponse);
  }

  /**
   * Function to scroll to bottom of chat container
   */
  private scrollToBottom() {
    try {
      const element = this.chatContainer.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}
