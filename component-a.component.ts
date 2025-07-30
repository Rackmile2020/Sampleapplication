import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentA implements OnInit {
  searchTerm = '';
  expandedItems: boolean[] = [];
  accordionData = [
    { title: 'First Item', content: 'This is the content for the first item' },
    { title: 'Second Item', content: 'This is the second content' },
    { title: 'Third Item', content: 'Another piece of content here' }
  ];

  constructor(private searchService: SearchService) {
    this.expandedItems = new Array(this.accordionData.length).fill(false);
  }

  ngOnInit() {
    this.searchService.currentSearchTerm.subscribe(term => {
      if (!term) {
        this.expandedItems = new Array(this.accordionData.length).fill(false);
      }
    });

    this.searchService.currentActiveMatchIndex.subscribe(index => {
      const activeMatch = this.searchService.getActiveMatchPosition();
      if (activeMatch && activeMatch.component === 'componentA') {
        this.expandedItems = new Array(this.accordionData.length).fill(false);
        this.expandedItems[activeMatch.itemIndex] = true;
      }
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
}
