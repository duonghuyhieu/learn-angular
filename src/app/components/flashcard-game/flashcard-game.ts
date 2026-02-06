import { Component, signal, computed, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-flashcard-game',
  imports: [CommonModule, FormsModule],
  templateUrl: './flashcard-game.html',
  styleUrl: './flashcard-game.scss'
})
export class FlashcardGame {
  private questionService = inject(QuestionService);

  @Output() backToMenu = new EventEmitter<void>();

  // Signals từ service
  gameState = this.questionService.gameState;
  currentQuestion = this.questionService.currentQuestion;
  progress = this.questionService.progress;
  categories = this.questionService.categories;
  difficulties = this.questionService.difficulties;

  // Local signals
  selectedCategory = signal('all');
  selectedDifficulty = signal('all');
  questionCount = signal(10);
  selectedAnswer = signal<number | null>(null);
  showResult = signal(false);
  isCorrect = signal(false);
  isFlipped = signal(false);
  gameStarted = signal(false);

  // Computed
  canProceed = computed(() => this.selectedAnswer() !== null);

  startGame(): void {
    this.questionService.startGame(
      this.selectedCategory(),
      this.selectedDifficulty(),
      this.questionCount()
    );
    this.gameStarted.set(true);
    this.resetQuestionState();
  }

  selectAnswer(index: number): void {
    if (this.showResult()) return;
    this.selectedAnswer.set(index);
  }

  submitAnswer(): void {
    const answer = this.selectedAnswer();
    if (answer === null) return;

    const correct = this.questionService.answerQuestion(answer);
    this.isCorrect.set(correct);
    this.showResult.set(true);
    this.isFlipped.set(true);
  }

  nextQuestion(): void {
    this.questionService.nextQuestion();
    this.resetQuestionState();
  }

  private resetQuestionState(): void {
    this.selectedAnswer.set(null);
    this.showResult.set(false);
    this.isCorrect.set(false);
    this.isFlipped.set(false);
  }

  restartGame(): void {
    this.questionService.resetGame();
    this.gameStarted.set(false);
    this.resetQuestionState();
  }

  goBack(): void {
    this.restartGame();
    this.backToMenu.emit();
  }

  getScoreMessage(): string {
    return this.questionService.getScoreMessage();
  }

  getCategoryLabel(cat: string): string {
    const labels: Record<string, string> = {
      'all': 'Tất cả',
      'basics': 'Cơ bản',
      'components': 'Components',
      'directives': 'Directives',
      'services': 'Services & DI',
      'routing': 'Routing',
      'forms': 'Forms',
      'rxjs': 'RxJS',
      'lifecycle': 'Lifecycle',
      'signals': 'Signals'
    };
    return labels[cat] || cat;
  }

  getDifficultyLabel(diff: string): string {
    const labels: Record<string, string> = {
      'all': 'Tất cả',
      'easy': 'Dễ',
      'medium': 'Trung bình',
      'hard': 'Khó'
    };
    return labels[diff] || diff;
  }
}
