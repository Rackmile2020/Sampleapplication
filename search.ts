import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  private currentMatchIndex = new BehaviorSubject<number>(-1);
  private matches: HTMLElement[] = [];
  public clearHighlights = new Subject<void>();

  searchTerm$ = this.searchTerm.asObservable();
  currentMatchIndex$ = this.currentMatchIndex.asObservable();

  setSearchTerm(term: string) {
    this.searchTerm.next(term);
    if (!term) {
      this.clearMatches();
    }
  }

  registerMatch(element: HTMLElement) {
    this.matches.push(element);
  }

  clearMatches() {
    this.matches = [];
    this.currentMatchIndex.next(-1);
    this.clearHighlights.next();
  }

  nextMatch() {
    if (this.matches.length === 0) return;
    const current = this.currentMatchIndex.value;
    const nextIndex = (current + 1) % this.matches.length;
    this.highlightCurrentMatch(nextIndex);
  }

  prevMatch() {
    if (this.matches.length === 0) return;
    const current = this.currentMatchIndex.value;
    const prevIndex = (current - 1 + this.matches.length) % this.matches.length;
    this.highlightCurrentMatch(prevIndex);
  }

  private highlightCurrentMatch(index: number) {
    // Reset previous highlight
    if (this.currentMatchIndex.value >= 0) {
      this.matches[this.currentMatchIndex.value].classList.remove('current-match');
    }
    
    // Apply new highlight
    this.currentMatchIndex.next(index);
    this.matches[index].classList.add('current-match');
    this.matches[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}