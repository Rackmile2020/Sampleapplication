import { Directive, Input, OnInit } from '@angular/core';
import { SearchService } from './search.service';

@Directive({ selector: '[appRegisterMatch]' })
export class RegisterMatchDirective implements OnInit {
  @Input() appRegisterMatch!: { comp: string; idx: number };
  @Input() hasMatch!: boolean;
  constructor(private svc: SearchService) {}
  ngOnInit() {
    if (this.hasMatch) {
      this.svc.register(this.appRegisterMatch.comp, this.appRegisterMatch.idx);
    }
  }
}
