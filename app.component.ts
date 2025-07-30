import { Component } from '@angular/core';
import { ComponentA } from './component-a.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ComponentA],
  template: `<app-component-a></app-component-a>`
})
export class AppComponent { }
