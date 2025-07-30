
// component-a.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentA implements OnInit, OnDestroy {
  searchTerm = '';
  expandedItems: boolean[] = [];
  activeMatchIndex = -1;
  totalMatches = 0;
  private subs = new Subscription();

  accordionData = [
    { title: 'First Item', content: 'This is the content for the first item' },
    { title: 'Second Item', content: 'This is the second content' },
    { title: 'Third Item', content: 'Another piece of content here' }
  ];

  constructor(public searchService: SearchService) {
    this.expandedItems = new Array(this.accordionData.length).fill(false);
  }

  ngOnInit() {
    this.subs.add(
      this.searchService.currentSearchTerm.subscribe(term => {
        if (term !== this.searchTerm.toLowerCase()) {
          this.searchTerm = term;
        }
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

  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }

  private updateExpandedStates() {
    if (!this.searchTerm) {
      this.expandedItems = new Array(this.accordionData.length).fill(false);
    } else {
      this.expandedItems = this.accordionData.map((item, index) => 
        this.hasMatches(item.title) || this.hasMatches(item.content)
    }
  }

  private updateActiveMatch() {
    const activeMatch = this.searchService.getActiveMatchPosition();
    if (activeMatch?.component === 'componentA') {
      this.expandedItems[activeMatch.itemIndex] = true;
      setTimeout(() => this.scrollToActiveMatch(), 100);
    }
  }

  // ... rest of the component remains the same
}
