import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(content: string, searchTerm: string, isActive: boolean): SafeHtml {
    if (!searchTerm || !content) {
      return this.sanitizer.bypassSecurityTrustHtml(content || '');
    }

    const regex = new RegExp(this.escapeRegExp(searchTerm), 'gi');
    const highlighted = content.replace(regex, match => 
      `<span class="highlight ${isActive ? 'active-highlight' : ''}">${match}</span>`
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}