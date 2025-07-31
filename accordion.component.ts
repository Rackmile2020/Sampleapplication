// accordion.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header" (click)="toggle()">{{ heading }}</div>
    <div class="body" *ngIf="expanded">
      <div [innerHTML]="highlightedContent"></div>
    </div>
  `,
  styles: [
    `.header { cursor: pointer; background: #eee; padding: 0.5rem; font-weight: bold; }`,
    `.body { padding: 0.5rem; border: 1px solid #ccc; }`,
    `mark.highlight { background: yellow; }`
  ]
})
export class AccordionComponent {
  @Input() heading = '';
  @Input() data = '';
  @Input() searchTerm = '';
  @Input() expanded = false;
  @Output() toggleAccordion = new EventEmitter<void>();

  get highlightedContent(): string {
    if (!this.searchTerm) return this.data;
    return this.data.replace(new RegExp(`(${this.escapeRegExp(this.searchTerm)})`, 'gi'), '<mark class="highlight">$1</mark>');
  }

  toggle() {
    this.toggleAccordion.emit();
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
