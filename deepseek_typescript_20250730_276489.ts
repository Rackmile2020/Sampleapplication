// search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm.asObservable();

  private activeMatchIndex = new BehaviorSubject<number>(-1);
  currentActiveMatchIndex = this.activeMatchIndex.asObservable();

  private totalMatches = new BehaviorSubject<number>(0);
  currentTotalMatches = this.totalMatches.asObservable();

  private matchPositions: {component: string, itemIndex: number}[] = [];
  
  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
    this.matchPositions = [];
    this.totalMatches.next(0);
    this.activeMatchIndex.next(-1);
  }

  registerMatch(component: string, itemIndex: number) {
    // Only register if not already registered
    if (!this.matchPositions.some(m => m.component === component && m.itemIndex === itemIndex)) {
      this.matchPositions.push({component, itemIndex});
      this.totalMatches.next(this.matchPositions.length);
      
      // Set first match as active if this is the first match
      if (this.matchPositions.length === 1) {
        this.activeMatchIndex.next(0);
      }
    }
  }

  getActiveMatchPosition() {
    if (this.activeMatchIndex.getValue() < 0 || this.activeMatchIndex.getValue() >= this.matchPositions.length) {
      return null;
    }
    return this.matchPositions[this.activeMatchIndex.getValue()];
  }

  navigateMatch(direction: 'up' | 'down') {
    if (this.matchPositions.length === 0) return;

    const currentIndex = this.activeMatchIndex.getValue();
    let newIndex = currentIndex;

    if (direction === 'up') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.matchPositions.length - 1;
    } else {
      newIndex = currentIndex < this.matchPositions.length - 1 ? currentIndex + 1 : 0;
    }

    this.activeMatchIndex.next(newIndex);
  }

  clearSearch() {
    this.searchTerm.next('');
    this.activeMatchIndex.next(-1);
    this.totalMatches.next(0);
    this.matchPositions = [];
  }
}
