import { OwlOptions } from 'ngx-owl-carousel-o';
import { Program } from './course-interface';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'course-suggestion';
  programs?: Program[];
}

export const carouselOptions: OwlOptions = {
  loop: true,
  // margin: 10,
  nav: false,
  responsive: {
    0: {
      items: 1,
    },
    480: {
      items: 2,
    },
    768: {
      items: 3,
    },
  },
};
