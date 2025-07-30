import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionComponent } from './accordion.component';
import { SearchService } from './search.service';

@Component({
  standalone: true,
  selector: 'app-component-a',
  imports: [FormsModule, AccordionComponent],
  template: `
    <div class="search">
      <input [(ngModel)]="term" (input)="onSearch()" placeholder="Search…" />
      <button (click)="svc.nav('up')">↑</button>
      <button (click)="svc.nav('down')">↓</button>
      <button (click)="clear()">×</button>
      <span *ngIf="svc.totalMatches | async as t">{{ (svc.activeIndex | async) + 1 }}/{{ t }}</span>
    </div>
    <app-accordion name="A" [data]="dataA"></app-accordion>
    <app-accordion name="B" [data]="dataB"></app-accordion>
    <app-accordion name="C" [data]="dataC"></app-accordion>
  `,
  styles: [`.search { margin-bottom:16px; }`]
})
export class ComponentA {
  term = '';
  dataA = [
    { title: 'Angular 19 Basic', content: 'Standalone components in Angular 19.' },
    { title: 'Search Example', content: 'Global search across A, B, C components.' }
  ];
  dataB = [
    { title: 'Component B Title', content: 'B content includes search term as well.' }
  ];
  dataC = [
    { title: 'C component', content: 'More content in component C.' }
  ];
  constructor(public svc: SearchService) {}

  onSearch() {
    this.svc.update(this.term);
  }
  clear() {
    this.term = '';
    this.svc.clear();
  }
}
