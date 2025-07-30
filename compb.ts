import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-component-b',
  template: `
    <div class="component">
      <h3>Component B</h3>
      
      <div *ngFor="let item of accordionData" class="accordion-item">
        <div 
          class="accordion-header"
          [class.expanded]="item.expanded"
          (click)="item.expanded = !item.expanded"
        >
          <span [appHighlight]="searchTerm">{{ item.title }}</span>
        </div>
        
        <div *ngIf="item.expanded" class="accordion-content">
          <p [appHighlight]="searchTerm">{{ item.content }}</p>
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
export class ComponentBComponent {
  @Input() searchTerm = '';
  
  accordionData = [
    { title: 'B Header 1', content: 'Component B content 1', expanded: false },
    { title: 'B Header 2', content: 'Component B content 2', expanded: false },
    { title: 'B Header 3', content: 'Component B content 3', expanded: false }
  ];
}