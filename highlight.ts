import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { SearchService } from '../services/search.service';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges, OnDestroy {
  @Input() appHighlight = '';
  @Input() accordionId?: string;
  private originalHTML = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private searchService: SearchService
  ) {
    this.originalHTML = this.el.nativeElement.innerHTML;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appHighlight']) {
      this.highlight(this.appHighlight);
    }
  }

  highlight(term: string) {
    this.clearHighlights();
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
      const matchId = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newHTML += `<span class="search-highlight" id="${matchId}" 
                  data-accordion-id="${this.accordionId}">${this.escapeHTML(match[0])}</span>`;
      lastIndex = regex.lastIndex;
    }

    // Remaining text after last match
    if (lastIndex < content.length) {
      newHTML += this.escapeHTML(content.substring(lastIndex));
    }

    // Update DOM
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', newHTML);

    // Register matches
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

  clearHighlights() {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML);
  }

  ngOnDestroy() {
    this.clearHighlights();
  }
}