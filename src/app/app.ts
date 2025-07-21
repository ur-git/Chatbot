import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Config } from './services/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet]
})
export class App {
  protected title = 'chatbot-app';

  constructor(private config: Config) {
  }
}
