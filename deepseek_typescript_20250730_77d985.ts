// component-a.component.ts
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentA implements OnInit {
  searchTerm = '';
  expandedItems: boolean[] = [];
  activeMatchIndex = -1;
  totalMatches = 0;
  private subscriptions: Subscription[] = [];

  accordionData = [
    { title: 'First Item', content: 'This is the content for the first item' },
    { title: 'Second Item', content: 'This is the second content' },
    { title: 'Third Item', content: 'Another piece of content here' }
  ];

  constructor(public searchService: SearchService) {
    this.expandedItems = new Array(this.accordionData.length).fill(false);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.searchService.currentSearchTerm.subscribe(term => {
        this.searchTerm = term;
        if (!term) {
          // Collapse all when search is cleared
          this.expandedItems = new Array(this.accordionData.length).fill(false);
        }
      }),

      this.searchService.currentActiveMatchIndex.subscribe(index => {
        this.activeMatchIndex = index;
        const activeMatch = this.searchService.getActiveMatchPosition();
        if (activeMatch && activeMatch.component === 'componentA') {
          // Expand only the active match item
          this.expandedItems = new Array(this.accordionData.length).fill(false);
          this.expandedItems[activeMatch.itemIndex] = true;
          this.scrollToActiveMatch();
        }
      }),

      this.searchService.currentTotalMatches.subscribe(count => {
        this.totalMatches = count;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }

  navigateUp() {
    this.searchService.navigateMatch('up');
  }

  navigateDown() {
    this.searchService.navigateMatch('down');
  }

  toggleItem(index: number) {
    if (!this.searchTerm) {
      // Only allow manual toggle when not searching
      this.expandedItems[index] = !this.expandedItems[index];
    }
  }

  private scrollToActiveMatch() {
    setTimeout(() => {
      const activeElement = document.querySelector('.active-highlight');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  hasMatches(text: string): boolean {
    return this.searchTerm && text.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  isItemActive(index: number): boolean {
    const activeMatch = this.searchService.getActiveMatchPosition();
    return activeMatch?.component === 'componentA' && activeMatch?.itemIndex === index;
  }
}
