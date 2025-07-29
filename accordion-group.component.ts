
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
