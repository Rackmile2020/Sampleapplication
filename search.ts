import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private querySubject = new BehaviorSubject<string>('');
  query$ = this.querySubject.asObservable();

  private matchElements: HTMLElement[] = [];
  private currentIndexSubject = new BehaviorSubject<number>(0);
  currentIndex$ = this.currentIndexSubject.asObservable();

  get currentIndex(): number {
    return this.currentIndexSubject.value;
  }

  get matchCount(): number {
    return this.matchElements.length;
  }

  setQuery(query: string) {
    this.querySubject.next(query);
    this.resetIndex();
  }

  resetIndex() {
    this.currentIndexSubject.next(0);
  }

  clear() {
    this.querySubject.next('');
    this.matchElements.forEach(el => el.classList.remove('highlight', 'current-highlight'));
    this.matchElements = [];
    this.currentIndexSubject.next(0);
  }

  registerMatches(matches: HTMLElement[]) {
    this.matchElements.forEach(el => el.classList.remove('highlight', 'current-highlight'));
    this.matchElements = matches;

    this.matchElements.forEach(el => el.classList.add('highlight'));
    this.resetIndex();
    this.highlightCurrent();
  }

  navigate(direction: 'up' | 'down') {
    const total = this.matchCount;
    if (total === 0) return;

    let newIndex = this.currentIndex;
    if (direction === 'down') {
      newIndex = (newIndex + 1) % total;
    } else {
      newIndex = (newIndex - 1 + total) % total;
    }
    this.currentIndexSubject.next(newIndex);
    this.highlightCurrent();
    this.scrollToCurrent();
  }

  private highlightCurrent() {
    this.matchElements.forEach((el, i) => {
      el.classList.toggle('current-highlight', i === this.currentIndex);
    });
  }

  private scrollToCurrent() {
    const el = this.matchElements[this.currentIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getDisplayIndex(): string {
    if (this.matchCount === 0) return '0/0';
    return `${this.currentIndex + 1}/${this.matchCount}`;
  }
}
