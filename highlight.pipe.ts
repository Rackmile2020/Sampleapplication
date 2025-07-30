import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(text: string, term: string, active: boolean): SafeHtml {
    if (!term || !text) return text;
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc, 'gi');
    const html = text.replace(re, m =>
      `<span class="highlight ${active ? 'active-highlight' : ''}">${m}</span>`
    );
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
