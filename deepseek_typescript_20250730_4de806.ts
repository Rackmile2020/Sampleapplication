import { Component } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-component-a',
  template: `
    <div class="search-container">
      <input 
        type="text" 
        [(ngModel)]="searchInput" 
        (input)="onSearch()"
        placeholder="Search..."
        #searchInputRef
        (keydown.arrowup)="prevMatch(); $event.preventDefault()"
        (keydown.arrowdown)="nextMatch(); $event.preventDefault()"
      >
      <button (click)="prevMatch()" title="Previous match">↑</button>
      <button (click)="nextMatch()" title="Next match">↓</button>
      <button (click)="clearSearch()" title="Clear search">✕</button>
    </div>

    <div class="accordion">
      <div *ngFor="let item of accordionData" class="accordion-item">
        <div 
          class="accordion-header"
          [class.expanded]="item.expanded"
        >
          <span appHighlight>{{ item.title }}</span>
        </div>
        
        <div *ngIf="item.expanded" class="accordion-content">
          <p appHighlight>{{ item.content }}</p>
        </div>
      </div>
    </div>
    
    <app-component-b></app-component-b>
    <app-component-c></app-component-c>
  `,
  styles: [`
    /* Add this to global styles or component styles */
    .search-highlight {
      background-color: yellow;
      font-weight: bold;
      padding: 0 2px;
    }
    
    .current-match {
      background-color: orange !important;
      outline: 2px solid red;
      position: relative;
      z-index: 10;
    }
    
    /* ... rest of your styles ... */
  `]
})
export class ComponentAComponent {
  searchInput = '';
  accordionData = [
    { title: 'Header 1', content: 'Content for section 1', expanded: false },
    { title: 'Header 2', content: 'Content for section 2', expanded: false },
    { title: 'Header 3', content: 'Content for section 3', expanded: false }
  ];

  constructor(private searchService: SearchService) {}

  onSearch() {
    this.searchService.setSearchTerm(this.searchInput);
    this.updateAccordions();
  }

  clearSearch() {
    this.searchInput = '';
    this.searchService.setSearchTerm('');
    this.accordionData.forEach(item => item.expanded = false);
  }

  nextMatch() {
    this.searchService.nextMatch();
  }

  prevMatch() {
    this.searchService.prevMatch();
  }

  private updateAccordions() {
    const term = this.searchInput.toLowerCase();
    if (!term) return;
    
    this.accordionData.forEach(item => {
      const title = item.title.toLowerCase();
      const content = item.content.toLowerCase();
      item.expanded = title.includes(term) || content.includes(term);
    });
  }
}