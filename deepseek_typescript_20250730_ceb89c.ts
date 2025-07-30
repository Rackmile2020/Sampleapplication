import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-component-b',
  template: `
    <div class="component">
      <h3>Component B</h3>
      
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
  `,
  styles: [`
    .component {
      margin-top: 30px;
      border-top: 2px solid #333;
      padding-top: 20px;
    }
  `]
})
export class ComponentBComponent implements OnInit, OnDestroy {
  accordionData = [
    { title: 'B Header 1', content: 'Component B content 1', expanded: false },
    { title: 'B Header 2', content: 'Component B content 2', expanded: false },
    { title: 'B Header 3', content: 'Component B content 3', expanded: false }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.searchTerm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.updateAccordions(term);
    });
  }

  updateAccordions(term: string) {
    if (!term) {
      this.accordionData.forEach(item => item.expanded = false);
      return;
    }
    
    term = term.toLowerCase();
    this.accordionData.forEach(item => {
      const title = item.title.toLowerCase();
      const content = item.content.toLowerCase();
      item.expanded = title.includes(term) || content.includes(term);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}