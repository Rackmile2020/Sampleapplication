import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  private currentMatchIndex = new BehaviorSubject<number>(-1);
  private matches: HTMLElement[] = [];
  private matchCount = new BehaviorSubject<number>(0);
  private accordionStates = new Map<string, boolean>();
  
  // Public observables
  searchTerm$ = this.searchTerm.asObservable();
  currentMatchIndex$ = this.currentMatchIndex.asObservable();
  matchCount$ = this.matchCount.asObservable();
  accordionStates$ = new Subject<Map<string, boolean>>();

  setSearchTerm(term: string) {
    this.matches = [];
    this.currentMatchIndex.next(-1);
    this.searchTerm.next(term);
    this.matchCount.next(0);
  }

  registerMatch(element: HTMLElement) {
    this.matches.push(element);
    this.matchCount.next(this.matches.length);
  }

  setAccordionState(id: string, expanded: boolean) {
    this.accordionStates.set(id, expanded);
    this.accordionStates$.next(this.accordionStates);
  }

  nextMatch() {
    if (this.matches.length === 0) return;
    
    let nextIndex = this.currentMatchIndex.value + 1;
    if (nextIndex >= this.matches.length) nextIndex = 0;
    
    this.highlightCurrentMatch(nextIndex);
  }

  prevMatch() {
    if (this.matches.length === 0) return;
    
    let prevIndex = this.currentMatchIndex.value - 1;
    if (prevIndex < 0) prevIndex = this.matches.length - 1;
    
    this.highlightCurrentMatch(prevIndex);
  }

  private highlightCurrentMatch(index: number) {
    // Reset previous highlight
    if (this.currentMatchIndex.value >= 0 && this.matches[this.currentMatchIndex.value]) {
      this.matches[this.currentMatchIndex.value].classList.remove('current-match');
    }
    
    // Apply new highlight
    this.currentMatchIndex.next(index);
    const currentElement = this.matches[index];
    currentElement.classList.add('current-match');
    
    // Expand accordion if needed
    const accordionId = currentElement.getAttribute('data-accordion-id');
    if (accordionId) {
      this.setAccordionState(accordionId, true);
    }
    
    // Scroll to match
    currentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }

  clearSearch() {
    this.setSearchTerm('');
    this.accordionStates.clear();
    this.accordionStates$.next(this.accordionStates);
  }
}