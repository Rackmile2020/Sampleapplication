// register-match.directive.ts
import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './search.service';

@Directive({
  selector: '[appRegisterMatch]'
})
export class RegisterMatchDirective implements OnInit, OnDestroy {
  @Input() appRegisterMatch: {component: string, itemIndex: number};
  @Input() hasMatches: boolean = false;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    if (this.hasMatches && this.appRegisterMatch) {
      this.searchService.registerMatch(
        this.appRegisterMatch.component,
        this.appRegisterMatch.itemIndex
      );
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
