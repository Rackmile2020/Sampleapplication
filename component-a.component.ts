
import { Component } from '@angular/core';
import { SearchService } from '../../core/search.service';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentAComponent {
  searchText = '';
  currentIndex = 0;

  dataA = [
    { head: 'Alpha A', body: 'Body text for first A entry.' },
    { head: 'Beta A',  body: 'Another body content from A.' }
  ];

  constructor(public search: SearchService) {}

  onSearch() {
    this.search.setTerm(this.searchText.trim());
  }

  clear() {
    this.searchText = '';
    this.search.clear();
  }

  navigate(dir: 'up' | 'down') {
    this.search.navigate(dir);
    this.currentIndex = this.search.currentIndex;
  }

  getCount() {
    return this.search.getCount();
  }
}
