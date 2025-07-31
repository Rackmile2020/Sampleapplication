import { 
  Directive, ElementRef, Input, OnChanges, 
  SimpleChanges, Renderer2, OnDestroy, OnInit 
} from '@angular/core';
import { SearchService } from '../services/search.service';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit, OnChanges, OnDestroy {
  @Input() appHighlight = '';
  @Input() accordionId?: string;
  private originalHTML = '';
  private matches: HTMLElement[] = [];
  private observer?: MutationObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Store original HTML content
    this.originalHTML = this.el.nativeElement.innerHTML;
    
    // Set up mutation observer to track content changes
    this.observer = new MutationObserver(() => {
      if (!this.appHighlight) {
        this.originalHTML = this.el.nativeElement.innerHTML;
      }
    });
    
    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Initial highlight if search term exists
    if (this.appHighlight) {
      setTimeout(() => this.highlight(this.appHighlight));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appHighlight']) {
      this.highlight(this.appHighlight);
    }
  }

  highlight(term: string) {
    if (!term) {
      this.clearHighlights();
      return;
    }

    // Create a temporary div to preserve HTML structure
    const tempDiv = this.renderer.createElement('div');
    this.renderer.setProperty(tempDiv, 'innerHTML', this.originalHTML);
    
    // Process all text nodes
    this.processTextNodes(tempDiv, term);
    
    // Update DOM with highlighted content
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', tempDiv.innerHTML);

    // Register matches
    this.matches = Array.from(this.el.nativeElement.querySelectorAll('.search-highlight'));
    this.matches.forEach(el => {
      if (this.accordionId) {
        this.renderer.setAttribute(el, 'data-accordion-id', this.accordionId);
      }
      this.searchService.registerMatch(el);
    });
  }

  private processTextNodes(node: Node, term: string) {
    if (node.nodeType === Node.TEXT_NODE) {
      this.processTextNode(node, term);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        this.processTextNodes(node.childNodes[i], term);
      }
    }
  }

  private processTextNode(node: Node, term: string) {
    const text = node.textContent || '';
    const regex = new RegExp(this.escapeRegex(term), 'gi');
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
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearHighlights();
  }
}
