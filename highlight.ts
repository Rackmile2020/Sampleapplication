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
  private matches: HTMLElement[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private searchService: SearchService
  ) {
    // Store original HTML content
    this.originalHTML = this.el.nativeElement.innerHTML;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appHighlight']) {
      this.highlight(this.appHighlight);
    }
  }

  highlight(term: string) {
    // Clear previous highlights
    this.clearHighlights();
    
    if (!term) {
      // Restore original content
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML);
      return;
    }

    // Get text content for matching
    const textContent = this.el.nativeElement.textContent || '';
    const regex = new RegExp(this.escapeRegex(term), 'gi');
    let match;
    let lastIndex = 0;
    let newHTML = '';

    // Create a temporary div to preserve HTML structure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.originalHTML;
    
    // Process all text nodes
    this.processNode(tempDiv, regex);
    
    // Update DOM with highlighted content
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', tempDiv.innerHTML);

    // Register matches
    this.matches = Array.from(this.el.nativeElement.querySelectorAll('.search-highlight'));
    this.matches.forEach(el => {
      if (this.accordionId) {
        el.setAttribute('data-accordion-id', this.accordionId);
      }
      this.searchService.registerMatch(el);
    });
  }

  private processNode(node: Node, regex: RegExp) {
    if (node.nodeType === Node.TEXT_NODE) {
      this.processTextNode(node, regex);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        this.processNode(node.childNodes[i], regex);
      }
    }
  }

  private processTextNode(node: Node, regex: RegExp) {
    const text = node.textContent || '';
    const matches = [...text.matchAll(regex)];
    
    if (matches.length === 0) return;
    
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    
    matches.forEach(match => {
      if (match.index === undefined) return;
      
      // Text before match
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(
          text.substring(lastIndex, match.index)
        ));
      }
      
      // Highlighted match
      const span = document.createElement('span');
      span.className = 'search-highlight';
      span.textContent = match[0];
      fragment.appendChild(span);
      
      lastIndex = match.index + match[0].length;
    });
    
    // Remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(
        text.substring(lastIndex)
      ));
    }
    
    // Replace original text node with fragment
    if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  }

  private escapeRegex(term: string): string {
    return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  clearHighlights() {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHTML);
    this.matches = [];
  }

  ngOnDestroy() {
    this.clearHighlights();
  }
}
