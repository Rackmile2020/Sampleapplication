// directives/register-match.directive.ts
import { Directive, Input, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';

@Directive({
  selector: '[appRegisterMatch]'
})
export class RegisterMatchDirective implements OnInit {
  @Input() appRegisterMatch: {component: string, itemIndex: number, isHeader: boolean};
  @Input() hasMatches: boolean;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    if (this.hasMatches) {
      this.searchService.registerMatch(
        this.appRegisterMatch.component,
        this.appRegisterMatch.itemIndex,
        this.appRegisterMatch.isHeader
      );
    }
  }
}