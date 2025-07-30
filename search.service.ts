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

  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
    this.activeMatchIndex.next(0);
  }

  updateActiveMatchIndex(index: number) {
    this.activeMatchIndex.next(index);
  }

  updateTotalMatches(count: number) {
    this.totalMatches.next(count);
  }

  navigateMatch(direction: 'up' | 'down') {
    const currentIndex = this.activeMatchIndex.getValue();
    const total = this.totalMatches.getValue();
    
    if (direction === 'up') {
      this.activeMatchIndex.next(currentIndex > 0 ? currentIndex - 1 : total - 1);
    } else {
      this.activeMatchIndex.next(currentIndex < total - 1 ? currentIndex + 1 : 0);
    }
  }
}
