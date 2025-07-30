import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  searchTerm = new BehaviorSubject<string>('');
  activeIndex = new BehaviorSubject<number>(0);
  totalMatches = new BehaviorSubject<number>(0);
  matches: { comp: string; idx: number }[] = [];

  update(term: string) {
    this.matches = [];
    this.searchTerm.next(term);
    this.activeIndex.next(0);
    this.totalMatches.next(0);
  }

  clear() {
    this.update('');
  }

  register(comp: string, idx: number) {
    if (!this.matches.some(m => m.comp === comp && m.idx === idx)) {
      this.matches.push({ comp, idx });
      this.totalMatches.next(this.matches.length);
    }
  }

  nav(dir: 'up' | 'down') {
    const total = this.matches.length;
    if (!total) return;
    const curr = this.activeIndex.value;
    const next = dir === 'up'
      ? (curr - 1 + total) % total
      : (curr + 1) % total;
    this.activeIndex.next(next);
  }

  current() {
    return this.matches[this.activeIndex.value];
  }
}
