import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { AccordionBaseComponent } from '../../shared/accordion-base.component';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentA extends AccordionBaseComponent {
  constructor(searchService: SearchService) {
    super(searchService);
    this.componentName = 'componentA';
    this.accordionData = [
      { 
        title: 'First Item', 
        content: '<p>This is <strong>HTML content</strong> for the first item</p>' 
      },
      { 
        title: 'Second Item', 
        content: '<div><em>Styled</em> content with <a href="#">link</a></div>' 
      },
      { 
        title: 'Third Item', 
        content: '<ul><li>List item 1</li><li>List item 2</li></ul>' 
      }
    ];
    this.expandedItems = new Array(this.accordionData.length).fill(false);
  }
}