import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SearchService {
  query$ = new BehaviorSubject<string>('');
  matchElements: HTMLElement[] = [];
  currentIndex = -1;

  // Exposed display for UI: "0/30", "1/30"
  displayIndex$ = combineLatest([
    this.query$,
    new BehaviorSubject(0) // trigger change
  ]).pipe(
    map(() => {
      const total = this.matchElements.length;
      if (total === 0) return `0/0`;
      return `${this.currentIndex + 1}/${total}`;
    })
  );

  setQuery(query: string) {
    this.query$.next(query);
    this.currentIndex = -1;
  }

  registerMatches(matches: HTMLElement[]) {
    this.matchElements = matches;
    this.currentIndex = -1;
    this.highlightCurrent();
  }

  navigate(direction: 'up' | 'down') {
    const total = this.matchElements.length;
    if (total === 0) return;

    if (direction === 'down') {
      this.currentIndex = (this.currentIndex + 1) % total;
    } else {
      this.currentIndex = (this.currentIndex - 1 + total) % total;
    }

    this.highlightCurrent();
    const el = this.matchElements[this.currentIndex];
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  highlightCurrent() {
    this.matchElements.forEach((el, index) => {
      el.classList.toggle('current-highlight', index === this.currentIndex);
    });
  }

  clear() {
    this.setQuery('');
    this.matchElements.forEach(el => el.classList.remove('highlight', 'current-highlight'));
    this.matchElements = [];
    this.currentIndex = -1;
  }
}
