import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeService } from '../../services/knowledge.service';

@Component({
  selector: 'app-knowledge-reader',
  imports: [CommonModule],
  templateUrl: './knowledge-reader.html',
  styleUrl: './knowledge-reader.scss'
})
export class KnowledgeReader {
  private knowledgeService = inject(KnowledgeService);

  @Output() backToMenu = new EventEmitter<void>();

  lessons = this.knowledgeService.lessons;
  selectedLesson = this.knowledgeService.selectedLesson;
  currentSection = this.knowledgeService.currentSection;
  currentSectionIndex = this.knowledgeService.currentSectionIndex;
  totalSections = this.knowledgeService.totalSections;
  nextLesson = this.knowledgeService.nextLesson;
  prevLesson = this.knowledgeService.prevLesson;
  isLastSection = this.knowledgeService.isLastSection;

  selectLesson(lessonId: string): void {
    this.knowledgeService.selectLesson(lessonId);
  }

  nextSection(): void {
    this.knowledgeService.nextSection();
  }

  prevSection(): void {
    this.knowledgeService.prevSection();
  }

  goToSection(index: number): void {
    this.knowledgeService.goToSection(index);
  }

  closeLesson(): void {
    this.knowledgeService.closeLesson();
  }

  goBack(): void {
    this.backToMenu.emit();
  }

  goToNextLesson(): void {
    this.knowledgeService.goToNextLesson();
  }

  goToPrevLesson(): void {
    this.knowledgeService.goToPrevLesson();
  }

  formatContent(content: string): string {
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/- (.+)/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  }
}
