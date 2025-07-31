// search-bar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input [(ngModel)]="searchText" (input)="onSearch()" placeholder="Search..." />
    <button (click)="prev()">⬆</button>
    <button (click)="next()">⬇</button>
    <span>{{ currentIndex + 1 }} / {{ matches.length }}</span>
    <button (click)="clear()">❌</button>
  `
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();
  searchText = '';
  matches: HTMLElement[] = [];
  currentIndex = 0;

  onSearch() {
    setTimeout(() => this.highlightMatches(), 0);
    this.searchChange.emit(this.searchText);
  }

  highlightMatches() {
    document.querySelectorAll('mark.highlight').forEach(el => {
      el.outerHTML = el.innerHTML;
    });
    this.matches = Array.from(document.querySelectorAll('mark.highlight')) as HTMLElement[];
    this.currentIndex = 0;
    this.scrollToCurrent();
  }

  scrollToCurrent() {
    if (this.matches.length && this.matches[this.currentIndex]) {
      this.matches[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  next() {
    if (!this.matches.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.matches.length;
    this.scrollToCurrent();
  }

  prev() {
    if (!this.matches.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.matches.length) % this.matches.length;
    this.scrollToCurrent();
  }

  clear() {
    this.searchText = '';
    this.onSearch();
  }
}
