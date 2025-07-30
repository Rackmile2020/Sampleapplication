// pipes/highlight.pipe.ts
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchTerm: string, activeIndex: number, matchIndex: number): any {
    if (!searchTerm || !value) {
      return value;
    }

    const re = new RegExp(searchTerm, 'gi');
    let matchCount = 0;
    
    const highlighted = value.replace(re, match => {
      const isActive = activeIndex === matchIndex + matchCount;
      matchCount++;
      return `<span class="highlight ${isActive ? 'active-highlight' : ''}">${match}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}