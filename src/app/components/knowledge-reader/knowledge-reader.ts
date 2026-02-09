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
    const lines = content.split('\n');
    let html = '';
    let i = 0;
    let textBuffer: string[] = [];

    const flushText = () => {
      if (textBuffer.length > 0) {
        const text = textBuffer.join('\n').trim();
        if (text) html += this.formatText(text);
        textBuffer = [];
      }
    };

    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        flushText();
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) html += this.parseTable(tableLines);
      } else {
        textBuffer.push(lines[i]);
        i++;
      }
    }
    flushText();
    return html;
  }

  private parseTable(lines: string[]): string {
    const parseRow = (line: string) => line.split('|').slice(1, -1).map(c => c.trim());
    const isSeparator = (line: string) => /^\|[\s\-:|]+\|$/.test(line);

    const headers = parseRow(lines[0]);
    const bodyStart = lines[1] && isSeparator(lines[1]) ? 2 : 1;

    let html = '<table><thead><tr>';
    headers.forEach(h => html += `<th>${this.formatInline(h)}</th>`);
    html += '</tr></thead><tbody>';

    for (let i = bodyStart; i < lines.length; i++) {
      if (isSeparator(lines[i])) continue;
      const cells = parseRow(lines[i]);
      html += '<tr>';
      cells.forEach(c => html += `<td>${this.formatInline(c)}</td>`);
      html += '</tr>';
    }
    return html + '</tbody></table>';
  }

  private formatInline(text: string): string {
    return text
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  private formatText(text: string): string {
    return text
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/- (.+)/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  }
}
