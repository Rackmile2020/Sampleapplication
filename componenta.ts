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
      >
      <button (click)="prevMatch()">↑</button>
      <button (click)="nextMatch()">↓</button>
      <button (click)="clearSearch()">✕</button>
    </div>

    <div class="accordion">
      <div *ngFor="let item of accordionData" class="accordion-item">
        <div 
          class="accordion-header"
          [class.expanded]="item.expanded"
          (click)="toggleItem(item)"
        >
          <span [appHighlight]="searchInput">{{ item.title }}</span>
        </div>
        
        <div *ngIf="item.expanded" class="accordion-content">
          <p [appHighlight]="searchInput">{{ item.content }}</p>
        </div>
      </div>
    </div>
    
    <app-component-b [searchTerm]="searchInput"></app-component-b>
    <app-component-c [searchTerm]="searchInput"></app-component-c>
  `,
  styles: [`
    .search-highlight {
      background-color: yellow;
      font-weight: bold;
    }
    
    .current-match {
      background-color: orange !important;
      outline: 2px solid red;
    }
    
    .accordion-item {
      border: 1px solid #ccc;
      margin-bottom: 5px;
    }
    
    .accordion-header {
      padding: 10px;
      background-color: #f1f1f1;
      cursor: pointer;
    }
    
    .accordion-content {
      padding: 10px;
      background-color: #fff;
    }
    
    .search-container {
      display: flex;
      gap: 5px;
      margin-bottom: 20px;
    }
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

  toggleItem(item: any) {
    item.expanded = !item.expanded;
  }

  private updateAccordions() {
    const term = this.searchInput.toLowerCase();
    if (!term) return;
    
    this.accordionData.forEach(item => {
      const hasMatch = item.title.toLowerCase().includes(term) || 
                      item.content.toLowerCase().includes(term);
      item.expanded = hasMatch;
    });
  }
}