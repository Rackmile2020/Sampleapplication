// component-a.component.ts
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentA implements OnInit {
  searchTerm = '';
  accordionData = [
    { title: 'First Item', content: 'This is the content for the first item' },
    { title: 'Second Item', content: 'This is the second content' },
    { title: 'Third Item', content: 'Another piece of content here' }
  ];

  constructor(private searchService: SearchService) {}

  ngOnInit() {}

  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchService.updateSearchTerm('');
  }

  navigateUp() {
    this.searchService.navigateMatch('up');
  }

  navigateDown() {
    this.searchService.navigateMatch('down');
  }
}
