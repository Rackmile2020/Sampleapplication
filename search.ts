import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  query$ = new BehaviorSubject<string>('');
  matchElements: HTMLElement[] = [];
  currentIndex = -1;

  setQuery(query: string) {
    this.query$.next(query);
    this.currentIndex = -1;
  }

  registerMatches(matches: HTMLElement[]) {
    this.matchElements = matches;
    this.currentIndex = -1;
  }

  getCount(): number {
    return this.matchElements.length;
  }

  navigate(direction: 'up' | 'down') {
    if (!this.matchElements.length) return;
    const total = this.matchElements.length;
    if (direction === 'down') this.currentIndex = (this.currentIndex + 1) % total;
    else this.currentIndex = (this.currentIndex - 1 + total) % total;

    const el = this.matchElements[this.currentIndex];
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.highlightCurrent();
  }

  highlightCurrent() {
    this.matchElements.forEach((el, index) => {
      el.classList.toggle('current-highlight', index === this.currentIndex);
    });
  }

  clear() {
    this.setQuery('');
    this.matchElements = [];
    this.currentIndex = -1;
  }
}
