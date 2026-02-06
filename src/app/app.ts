import { Component, signal } from '@angular/core';
import { FlashcardGame } from './components/flashcard-game/flashcard-game';
import { KnowledgeReader } from './components/knowledge-reader/knowledge-reader';

type AppMode = 'menu' | 'quiz' | 'learn';

@Component({
  selector: 'app-root',
  imports: [FlashcardGame, KnowledgeReader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  currentMode = signal<AppMode>('menu');

  setMode(mode: AppMode): void {
    this.currentMode.set(mode);
  }
}
