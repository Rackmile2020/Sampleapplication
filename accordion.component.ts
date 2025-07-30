import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SearchService } from './search.service';
import { HighlightPipe } from './highlight.pipe';
import { RegisterMatchDirective } from './register-match.directive';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, HighlightPipe, RegisterMatchDirective],
  template: `
    <div *ngFor="let item of data; let i = index">
      <div class="header"
           (click)="toggle(i)"
           [innerHTML]="item.title | highlight:term:isActive(i)"
           [appRegisterMatch]="{ comp: name, idx: i }"
           [hasMatch]="hasMatch(item.title)">
      </div>
      <div class="body" *ngIf="expanded[i]"
           [innerHTML]="item.content | highlight:term:isActive(i)"
           [appRegisterMatch]="{ comp: name, idx: i }"
           [hasMatch]="hasMatch(item.content)">
      </div>
    </div>
  `,
  styles: [`
    .highlight { background: yellow; }
    .active-highlight { background: orange; }
    .header { cursor: pointer; padding: 8px; border: 1px solid #ddd; margin:4px 0; }
    .body { padding: 8px 16px; }
  `]
})
export class AccordionComponent implements OnInit, OnDestroy {
  @Input() name = '';
  @Input() data: { title: string; content: string }[] = [];

  term = '';
  expanded: boolean[] = [];
  activeIdx = -1;
  sub = new Subscription();

  constructor(private svc: SearchService) {}

  ngOnInit() {
    this.expanded = this.data.map(() => false);
    this.sub.add(this.svc.searchTerm.subscribe(t => {
      this.term = t; this.updateExpansions();
    }));
    this.sub.add(this.svc.activeIndex.subscribe(n => this.activeIdx = n));
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  hasMatch(text: string): boolean {
    return this.term ? text.toLowerCase().includes(this.term.toLowerCase()) : false;
  }
  isActive(i: number): boolean {
    const cur = this.svc.current();
    return cur?.comp === this.name && cur.idx === i;
  }
  toggle(i: number): void {
    this.expanded[i] = !this.expanded[i];
  }
  updateExpansions() {
    if (!this.term) {
      this.expanded = this.data.map(() => false);
    } else {
      this.expanded = this.data.map(item =>
        this.hasMatch(item.title) || this.hasMatch(item.content)
      );
    }
  }
}
