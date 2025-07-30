import { 
  Directive, ElementRef, Input, OnChanges, 
  SimpleChanges, Renderer2, OnDestroy 
} from '@angular/core';
import { SearchService } from './search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges, OnDestroy {
  @Input() appHighlight = '';
  private destroy$ = new Subject<void>();
  private originalHTML = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private searchService: SearchService
  ) {
    // Store original HTML content
    this.originalHTML = this.el.nativeElement.innerHTML;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appHighlight) {
      this.highlight(this.appHighlight);
    }
  }

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
    const regex = new RegExp(this.escapeRegex(term), 'gi');
    let match;
    let lastIndex = 0;
    let newHTML = '';

    while ((match = regex.exec(content)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        newHTML += this.escapeHTML(content.substring(lastIndex, match.index));
      }

      // Highlighted match
      newHTML += `<span class="search-highlight">${this.escapeHTML(match[0])}</span>`;
      
      // Register match with service
      // We'll register after DOM update
      lastIndex = regex.lastIndex;
    }

    // Remaining text after last match
    if (lastIndex < content.length) {
      newHTML += this.escapeHTML(content.substring(lastIndex));
    }

    // Update DOM
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', newHTML);

    // Now register all matches
    const matches = this.el.nativeElement.querySelectorAll('.search-highlight');
    matches.forEach((el: HTMLElement) => {
      this.searchService.registerMatch(el);
    });
  }

  private escapeRegex(term: string): string {
    return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private escapeHTML(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  removeHighlights() {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
