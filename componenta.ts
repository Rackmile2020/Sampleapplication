import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { HighlightDirective } from '../../../core/directives/highlight.directive';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-component-a',
  standalone: true,
  imports: [CommonModule, HighlightDirective],
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.scss']
})
export class ComponentAComponent implements OnInit, OnDestroy {
  items = [
    { id: 'a-1', title: 'First Item', content: 'This is the content for the first item', expanded: false },
    { id: 'a-2', title: 'Second Item', content: 'Second item content with more details', expanded: false },
    { id: 'a-3', title: 'Third Item', content: 'Third item has different information', expanded: false }
  ];
  
  private destroy$ = new Subject<void>();
  currentSearchTerm = '';

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.searchTerm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.currentSearchTerm = term;
      if (term) {
        this.updateAccordions(term);
      }
    });
    
    this.searchService.accordionStates$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(states => {
      this.items.forEach(item => {
        const state = states.get(item.id);
        if (state !== undefined) {
          item.expanded = state;
        }
      });
    });
  }

  toggleItem(item: any) {
    // Only allow manual toggle when no active search
    if (!this.currentSearchTerm) {
      item.expanded = !item.expanded;
      this.searchService.setAccordionState(item.id, item.expanded);
    }
  }

  private updateAccordions(term: string) {
    const searchTerm = term.toLowerCase();
    
    this.items.forEach(item => {
      const hasMatch = item.title.toLowerCase().includes(searchTerm) || 
                      item.content.toLowerCase().includes(searchTerm);
      
      this.searchService.setAccordionState(item.id, hasMatch);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
