import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  template: ''
})
export class AccordionBaseComponent implements OnInit, OnDestroy {
  @Input() componentName: string = '';
  @Input() accordionData: any[] = [];
  expandedItems: boolean[] = [];
  activeMatchIndex = -1;
  totalMatches = 0;
  searchTerm = '';
  protected subs = new Subscription();

  constructor(protected searchService: SearchService) {}

  ngOnInit() {
    this.subs.add(
      this.searchService.currentSearchTerm.subscribe(term => {
        this.searchTerm = term;
        this.updateExpandedStates();
      })
    );

    this.subs.add(
      this.searchService.currentActiveMatchIndex.subscribe(index => {
        this.activeMatchIndex = index;
        this.updateActiveMatch();
      })
    );

    this.subs.add(
      this.searchService.currentTotalMatches.subscribe(count => {
        this.totalMatches = count;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  toggleItem(index: number): void {
    if (this.searchTerm) {
      if (this.hasMatches(this.accordionData[index].title) || 
          this.hasMatches(this.accordionData[index].content)) {
        const matchIndex = this.findMatchIndex(index);
        if (matchIndex !== -1) {
          this.searchService.updateActiveMatchIndex(matchIndex);
        }
      }
      return;
    }
    
    this.expandedItems[index] = !this.expandedItems[index];
  }

  shouldShowContent(index: number): boolean {
    return this.expandedItems[index] || 
           (this.searchTerm && this.isItemActive(index));
  }

  hasMatches(text: string): boolean {
    return text && this.searchTerm && 
           text.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  isItemActive(index: number): boolean {
    const activeMatch = this.searchService.getActiveMatchPosition();
    return activeMatch?.component === this.componentName && 
           activeMatch?.itemIndex === index;
  }

  protected updateExpandedStates() {
    if (!this.searchTerm) {
      this.expandedItems = new Array(this.accordionData.length).fill(false);
    } else {
      this.expandedItems = this.accordionData.map((item, index) => 
        this.hasMatches(item.title) || this.hasMatches(item.content)
      );
    }
  }

  protected updateActiveMatch() {
    const activeMatch = this.searchService.getActiveMatchPosition();
    if (activeMatch?.component === this.componentName) {
      this.expandedItems[activeMatch.itemIndex] = true;
      setTimeout(() => this.scrollToActiveMatch(), 100);
    }
  }

  private findMatchIndex(itemIndex: number): number {
    const matches = (this.searchService as any).matchPositions;
    return matches.findIndex(m => 
      m.component === this.componentName && m.itemIndex === itemIndex
    );
  }

  private scrollToActiveMatch() {
    const activeElement = document.querySelector('.active-highlight');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}