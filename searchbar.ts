import { Component } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchTerm = '';
  currentIndex = 0;
  totalMatches = 0;

  constructor(private searchService: SearchService) {
    this.searchService.currentMatchIndex$.subscribe(index => {
      this.currentIndex = index + 1;
    });
    
    this.searchService.matchCount$.subscribe(count => {
      this.totalMatches = count;
    });
  }

  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
  }

  nextMatch() {
    this.searchService.nextMatch();
  }

  prevMatch() {
    this.searchService.prevMatch();
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }
}