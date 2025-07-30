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
    // Clear previous matches
    this.matches = [];
    this.currentMatchIndex.next(-1);
    
    // Emit new term
    this.searchTerm.next(term);
    this.clearHighlights.next();
  }

  registerMatch(element: HTMLElement) {
    this.matches.push(element);
  }

  nextMatch() {
    if (this.matches.length === 0) return;
    
    let nextIndex = this.currentMatchIndex.value + 1;
    if (nextIndex >= this.matches.length) {
      nextIndex = 0; // Wrap to first match
    }
    
    this.highlightCurrentMatch(nextIndex);
  }

  prevMatch() {
    if (this.matches.length === 0) return;
    
    let prevIndex = this.currentMatchIndex.value - 1;
    if (prevIndex < 0) {
      prevIndex = this.matches.length - 1; // Wrap to last match
    }
    
    this.highlightCurrentMatch(prevIndex);
  }

  private highlightCurrentMatch(index: number) {
    // Reset previous highlight
    if (this.currentMatchIndex.value >= 0 && this.matches[this.currentMatchIndex.value]) {
      this.matches[this.currentMatchIndex.value].classList.remove('current-match');
    }
    
    // Apply new highlight
    this.currentMatchIndex.next(index);
    this.matches[index].classList.add('current-match');
    
    // Scroll to match
    this.matches[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }
}