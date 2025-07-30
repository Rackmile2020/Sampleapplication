
import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';

@Component({
  selector: 'app-accordion-group',
  templateUrl: './accordion-group.component.html',
  styleUrls: ['./accordion-group.component.css']
})
export class AccordionGroupComponent implements OnInit {
  @Input() data: { head: string; body: string; expanded?: boolean }[] = [];
  @ViewChild('container') container!: ElementRef;

  constructor(private search: SearchService) {}

  ngOnInit() {
    this.search.searchTerm$.subscribe(term => {
      this.clearHighlights();
      this.data.forEach(d => d.expanded = false);
      if (!term) {
        this.search.registerMatches([]);
        return;
      }

      setTimeout(() => {
        const hits: HTMLElement[] = [];
        const elems = this.container.nativeElement.querySelectorAll('.searchable');
        elems.forEach((el: HTMLElement) => {
          const t = el.innerText;
          const regex = new RegExp(`(${term})`, 'gi');
          if (regex.test(t)) {
            el.innerHTML = t.replace(regex, '<span class="highlight">$1</span>');
            const parent = el.closest('.accordion');
            if (parent) {
              const idx = +parent.getAttribute('data-index')!;
              this.data[idx].expanded = true;
            }
          }
        });

        setTimeout(() => {
          const allHighlighted = this.container.nativeElement.querySelectorAll('.highlight');
          hits.push(...(Array.from(allHighlighted) as HTMLElement[]));
          this.search.registerMatches(hits);
        });
      });
    });
  }

  clearHighlights() {
    const spans = this.container.nativeElement.querySelectorAll('.highlight');
    spans.forEach(span => {
      const parent = span.parentNode!;
      parent.replaceChild(document.createTextNode(span.textContent!), span);
      parent.normalize();
    });
  }

  toggle(i: number) {
    this.data[i].expanded = !this.data[i].expanded;
  }
}
//////////////////////
// register-match.directive.ts
import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './search.service';

@Directive({
  selector: '[appRegisterMatch]'
})
export class RegisterMatchDirective implements OnInit, OnDestroy {
  @Input() appRegisterMatch: {component: string, itemIndex: number};
  @Input() hasMatches: boolean;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    if (this.hasMatches) {
      this.searchService.registerMatch(this.appRegisterMatch.component, this.appRegisterMatch.itemIndex);
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
//////////////////////
<!-- Updated component-a.component.html with directive -->
<div class="accordion">
  <div class="accordion-item" *ngFor="let item of accordionData; let i = index">
    <div class="accordion-header" 
         (click)="toggleItem(i)"
         [innerHTML]="item.title | highlight:searchTerm:activeMatchIndex"
         [class.active-match]="isActiveMatch('componentA', i)"
         [appRegisterMatch]="{component: 'componentA', itemIndex: i}"
         [hasMatches]="searchTerm && item.title.toLowerCase().includes(searchTerm.toLowerCase())">
    </div>
    <div class="accordion-content" 
         *ngIf="expandedItems[i]"
         [innerHTML]="item.content | highlight:searchTerm:activeMatchIndex"
         [class.active-match]="isActiveMatch('componentA', i)"
         [appRegisterMatch]="{component: 'componentA', itemIndex: i}"
         [hasMatches]="searchTerm && item.content.toLowerCase().includes(searchTerm.toLowerCase())">
    </div>
  </div>
</div>

  ////////////


  import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-component-b',
  templateUrl: './component-b.component.html',
  styleUrls: ['./component-b.component.css']
})
export class ComponentB implements OnInit {
  expandedItems: boolean[] = [];
  accordionData = [
    { title: 'Component B Item 1', content: 'Data specific to component B' },
    { title: 'Another B Item', content: 'More content in component B' }
  ];

  constructor(public searchService: SearchService) {
    this.expandedItems = new Array(this.accordionData.length).fill(false);
  }

  ngOnInit() {
    this.searchService.currentSearchTerm.subscribe(term => {
      if (!term) {
        this.expandedItems = new Array(this.accordionData.length).fill(false);
      }
    });

    this.searchService.currentActiveMatchIndex.subscribe(index => {
      const activeMatch = this.searchService.getActiveMatchPosition();
      if (activeMatch && activeMatch.component === 'componentB') {
        this.expandedItems = new Array(this.accordionData.length).fill(false);
        this.expandedItems[activeMatch.itemIndex] = true;
      }
    });
  }

  toggleItem(index: number) {
    if (!this.searchService.currentSearchTerm) {
      this.expandedItems[index] = !this.expandedItems[index];
    }
  }

  isActiveMatch(component: string, index: number): boolean {
    const activeMatch = this.searchService.getActiveMatchPosition();
    return activeMatch?.component === component && activeMatch?.itemIndex === index;
  }
}
