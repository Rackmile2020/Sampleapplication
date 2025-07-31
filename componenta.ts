import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion.component';

@Component({
  selector: 'app-component-a',
  standalone: true,
  imports: [CommonModule, AccordionComponent],
  template: `
    <app-accordion
      *ngFor="let item of items; let i = index"
      [heading]="item.heading"
      [data]="item.data"
      [searchTerm]="searchTerm"
      [expanded]="shouldExpand(item)"
      (toggleAccordion)="toggle(item)"
    ></app-accordion>
  `
})
export class ComponentA {
  @Input() searchTerm = '';

  items = [
    {
      id: 36,
      heading: 'sample',
      data: `<div class="tile_wrap d-flex align-items-stretch px-0 px-md-0 mb-2 g-2 g-md-4">
        <div class="static_wrap d-flex flex-column flex-md-row justify-content-between p-3 px-md-4">
        <p>This is a sample paragraph with search keyword Angular</p></div></div>`,
      expanded: false,
    },
    {
      id: 37,
      heading: 'example',
      data: '<div><p>Another example with the term Angular again</p></div>',
      expanded: false
    }
  ];

  toggle(clicked: any) {
    this.items = this.items.map(item =>
      item.id === clicked.id ? { ...item, expanded: !item.expanded } : item
    );
  }

  shouldExpand(item: any) {
    if (!this.searchTerm) return item.expanded;
    const lower = this.searchTerm.toLowerCase();
    return item.data.toLowerCase().includes(lower) || item.heading.toLowerCase().includes(lower);
  }
}
