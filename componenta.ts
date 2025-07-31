import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { HighlightDirective } from '../../../core/directives/highlight.directive';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-component-a',
  standalone: true,
  imports: [CommonModule, HighlightDirective],
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.scss']
})
export class ComponentAComponent implements OnInit, OnDestroy {
  items = [
    { 
      id: 'a-1', 
      title: 'First Item', 
      content: 'This is <strong>bold</strong> content for the first item', 
      expanded: false,
      safeContent: null as SafeHtml | null
    },
    { 
      id: 'a-2', 
      title: 'Second Item', 
      content: 'Second item content with <em>italic</em> text', 
      expanded: false,
      safeContent: null as SafeHtml | null
    },
    { 
      id: 'a-3', 
      title: 'Third Item', 
      content: 'Third item has <u>underlined</u> information', 
      expanded: false,
      safeContent: null as SafeHtml | null
    }
  ];
  
  private destroy$ = new Subject<void>();
  currentSearchTerm = '';

  constructor(
    private searchService: SearchService,
    private sanitizer: DomSanitizer
  ) {
    // Sanitize HTML content
    this.items.forEach(item => {
      item.safeContent = this.sanitizer.bypassSecurityTrustHtml(item.content);
    });
  }

  ngOnInit() {
    this.searchService.searchTerm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.currentSearchTerm = term;
      if (term) {
        this.updateAccordions(term);
      } else {
        // Reset safeContent when search is cleared
        this.items.forEach(item => {
          item.safeContent = this.sanitizer.bypassSecurityTrustHtml(item.content);
        });
      }
    });
    
    this.searchService.accordionStates$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(states => {
      this.items.forEach(item => {
        const state = states.get(item.id);
        if (state !== undefined) {
          item.expanded = state;
        }
      });
    });
  }

  toggleItem(item: any) {
    if (!this.currentSearchTerm) {
      item.expanded = !item.expanded;
      this.searchService.setAccordionState(item.id, item.expanded);
    }
  }

  private updateAccordions(term: string) {
    const searchTerm = term.toLowerCase();
    
    this.items.forEach(item => {
      // Create text-only version for matching
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.content;
      const textContent = tempDiv.textContent || '';
      
      const hasMatch = item.title.toLowerCase().includes(searchTerm) || 
                      textContent.toLowerCase().includes(searchTerm);
      
      this.searchService.setAccordionState(item.id, hasMatch);
      
      // Highlight content while preserving HTML
      if (hasMatch) {
        const highlighted = this.highlightHTML(item.content, searchTerm);
        item.safeContent = this.sanitizer.bypassSecurityTrustHtml(highlighted);
      } else {
        item.safeContent = this.sanitizer.bypassSecurityTrustHtml(item.content);
      }
    });
  }

  private highlightHTML(html: string, term: string): string {
    if (!term) return html;
    
    const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    this.highlightTextNodes(tempDiv, regex);
    
    return tempDiv.innerHTML;
  }

  private highlightTextNodes(node: Node, regex: RegExp) {
    if (node.nodeType === Node.TEXT_NODE) {
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
    else if (node.nodeType === Node.ELEMENT_NODE) {
      // Process child nodes recursively
      for (let i = 0; i < node.childNodes.length; i++) {
        this.highlightTextNodes(node.childNodes[i], regex);
      }
    }
  }

  private escapeRegex(term: string): string {
    return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
