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
    const fragment = this.renderer.createDocumentFragment();

    while ((match = regex.exec(content)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        const textNode = this.renderer.createText(
          content.substring(lastIndex, match.index)
        );
        this.renderer.appendChild(fragment, textNode);
      }

      // Highlighted match
      const span = this.renderer.createElement('span');
      this.renderer.addClass(span, 'search-highlight');
      this.renderer.setProperty(span, 'textContent', match[0]);
      this.renderer.appendChild(fragment, span);
      
      // Register match with service
      this.searchService.registerMatch(span);

      lastIndex = regex.lastIndex;
    }

    // Remaining text after last match
    if (lastIndex < content.length) {
      const textNode = this.renderer.createText(
        content.substring(lastIndex)
      );
      this.renderer.appendChild(fragment, textNode);
    }

    // Update DOM
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');
    this.renderer.appendChild(this.el.nativeElement, fragment);
  }

  private escapeRegex(term: string): string {
    return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  removeHighlights() {
    // Restore original content instead of trying to replace nodes
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
