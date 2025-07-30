// highlight.pipe.ts
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchTerm: string, isActive: boolean): SafeHtml {
    if (!searchTerm || !value) {
      return value;
    }

    const re = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const highlighted = value.replace(re, match => 
      `<span class="highlight ${isActive ? 'active-highlight' : ''}">${match}</span>`
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
