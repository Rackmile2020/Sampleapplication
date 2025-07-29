
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private term$ = new BehaviorSubject<string>('');
  searchTerm$ = this.term$.asObservable();
  private matches: HTMLElement[] = [];
  currentIndex = 0;

  setTerm(term: string) {
    this.term$.next(term);
    this.currentIndex = 0;
  }

  clear() {
    this.term$.next('');
    this.matches.forEach(el => {
      el.classList.remove('highlight', 'active-match');
    });
    this.matches = [];
    this.currentIndex = 0;
  }

  registerMatches(matches: HTMLElement[]) {
    this.matches.forEach(el => el.classList.remove('active-match'));
    this.matches = matches;
  }

  getCount(): number {
    return this.matches.length;
  }

  navigate(dir: 'up' | 'down') {
    if (!this.matches.length) return;

    this.matches[this.currentIndex]?.classList.remove('active-match');
    this.currentIndex = dir === 'down'
      ? (this.currentIndex + 1) % this.matches.length
      : (this.currentIndex - 1 + this.matches.length) % this.matches.length;
    const el = this.matches[this.currentIndex];
    el.classList.add('active-match');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
