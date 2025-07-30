// search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm.asObservable();

  private activeMatchIndex = new BehaviorSubject<number>(0);
  currentActiveMatchIndex = this.activeMatchIndex.asObservable();

  private totalMatches = new BehaviorSubject<number>(0);
  currentTotalMatches = this.totalMatches.asObservable();

  private matchPositions: {component: string, itemIndex: number}[] = [];
  
  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
    this.activeMatchIndex.next(0);
    this.matchPositions = [];
    this.updateTotalMatches(0); // Reset total matches when search term changes
  }

  registerMatch(component: string, itemIndex: number) {
    this.matchPositions.push({component, itemIndex});
    this.updateTotalMatches(this.matchPositions.length); // Now properly updating
  }

  getActiveMatchPosition() {
    if (this.matchPositions.length === 0) return null;
    return this.matchPositions[this.activeMatchIndex.getValue()];
  }

  navigateMatch(direction: 'up' | 'down') {
    const currentIndex = this.activeMatchIndex.getValue();
    const total = this.totalMatches.getValue();
    
    if (total === 0) return; // No matches to navigate

    if (direction === 'up') {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : total - 1;
      this.activeMatchIndex.next(newIndex);
    } else {
      const newIndex = currentIndex < total - 1 ? currentIndex + 1 : 0;
      this.activeMatchIndex.next(newIndex);
    }
  }

  clearSearch() {
    this.searchTerm.next('');
    this.activeMatchIndex.next(0);
    this.totalMatches.next(0);
    this.matchPositions = [];
  }

  private updateTotalMatches(count: number) {
    this.totalMatches.next(count);
    // Reset active index if it's beyond the new count
    if (this.activeMatchIndex.getValue() >= count && count > 0) {
      this.activeMatchIndex.next(count - 1);
    } else if (count === 0) {
      this.activeMatchIndex.next(0);
    }
  }
}
