// components/component-b/component-b.component.ts
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-component-b',
  templateUrl: './component-b.component.html',
  styleUrls: ['./component-b.component.css']
})
export class ComponentB implements OnInit {
  expandedItems: boolean[] = [];
  activeMatchIndex = 0;

  accordionData = [
    { title: 'Component B Item 1', content: 'Data specific to component B' },
    { title: 'Another B Item', content: 'More content in component B' }
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
      if (activeMatch && activeMatch.component === 'componentB') {
        this.expandedItems = new Array(this.accordionData.length).fill(false);
        this.expandedItems[activeMatch.itemIndex] = true;
        setTimeout(() => this.scrollToActiveMatch(), 100);
      }
    });
  }

  // ... (same helper methods as Component A)
}