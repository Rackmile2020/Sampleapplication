// components/component-a/component-a.component.ts
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentA implements OnInit {
  searchTerm = '';
  expandedItems: boolean[] = [];
  activeMatchIndex = 0;
  totalMatches = 0;

  accordionData = [
    { title: 'First Item', content: 'This is the content for the first item' },
    { title: 'Second Item', content: 'This is the second content' },
    { title: 'Third Item', content: 'Another piece of content here' }
  ];

  constructor(public searchService: SearchService) {
    this.expandedItems = new Array(this.accordionData.length).fill(false);
  }

  ngOnInit() {
    this.searchService.currentSearchTerm.subscribe(term => {
      if (!term) {
        this.expandedItems = new Array(this.accordionData.length).fill(false);
      }
    });

    this.searchService.currentActiveMatchIndex.subscribe(index => {
      this.activeMatchIndex = index;
      const activeMatch = this.searchService.getActiveMatchPosition();
      if (activeMatch && activeMatch.component === 'componentA') {
        this.expandedItems = new Array(this.accordionData.length).fill(false);
        this.expandedItems[activeMatch.itemIndex] = true;
        setTimeout(() => this.scrollToActiveMatch(), 100);
      }
    });

    this.searchService.currentTotalMatches.subscribe(count => {
      this.totalMatches = count;
    });
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
      this.expandedItems[index] = !this.expandedItems[index];
    }
  }

  private scrollToActiveMatch() {
    const activeElement = document.querySelector('.active-highlight');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  isActiveMatch(component: string, index: number): boolean {
    const activeMatch = this.searchService.getActiveMatchPosition();
    return activeMatch?.component === component && activeMatch?.itemIndex === index;
  }

  hasMatches(text: string): boolean {
    return this.searchTerm && text.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  getMatchIndex(itemIndex: number, isHeader: boolean): number {
    // This would need to be calculated based on your actual match positions
    // For simplicity, we'll return a unique index for each potential match
    return itemIndex * 2 + (isHeader ? 0 : 1);
  }
}