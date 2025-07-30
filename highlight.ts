import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit, OnDestroy {
  @Input() appHighlight = '';
  private destroy$ = new Subject<void>();

  constructor(
    private el: ElementRef,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.searchService.searchTerm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.highlight(term);
    });

    this.searchService.clearHighlights.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.removeHighlights();
    });
  }

  highlight(term: string) {
    this.removeHighlights();
    if (!term) return;

    const content = this.el.nativeElement.textContent;
    const regex = new RegExp(term, 'gi');
    let match;
    let lastIndex = 0;
    const fragment = document.createDocumentFragment();

    while ((match = regex.exec(content)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(
          content.substring(lastIndex, match.index)
        );
      }

      // Create highlight span
      const span = document.createElement('span');
      span.className = 'search-highlight';
      span.textContent = match[0];
      fragment.appendChild(span);
      
      // Register with service
      this.searchService.registerMatch(span);

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      fragment.appendChild(document.createTextNode(
        content.substring(lastIndex))
      );
    }

    // Update DOM
    this.el.nativeElement.innerHTML = '';
    this.el.nativeElement.appendChild(fragment);
  }

  removeHighlights() {
    const elements = this.el.nativeElement.querySelectorAll('.search-highlight');
    elements.forEach((el: HTMLElement) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}