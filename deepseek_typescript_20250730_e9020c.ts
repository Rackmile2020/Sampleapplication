// search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTerm.asObservable().pipe(distinctUntilChanged());

  private activeMatchIndex = new BehaviorSubject<number>(-1);
  currentActiveMatchIndex = this.activeMatchIndex.asObservable();

  private totalMatches = new BehaviorSubject<number>(0);
  currentTotalMatches = this.totalMatches.asObservable();

  private matchPositions: {component: string, itemIndex: number}[] = [];
  
  updateSearchTerm(term: string) {
    this.searchTerm.next(term.trim().toLowerCase());
    this.matchPositions = [];
    this.totalMatches.next(0);
    this.activeMatchIndex.next(-1);
  }

  registerMatch(component: string, itemIndex: number) {
    if (!this.matchPositions.some(m => m.component === component && m.itemIndex === itemIndex)) {
      this.matchPositions.push({component, itemIndex});
      this.totalMatches.next(this.matchPositions.length);
      if (this.matchPositions.length === 1) {
        this.activeMatchIndex.next(0);
      }
    }
  }

  // ... rest of the service remains the same
}