// core/search.service.ts
@Injectable({ providedIn: 'root' })
export class SearchService {
  private term$ = new BehaviorSubject<string>('');
  searchTerm$ = this.term$.asObservable();

  private matches: HTMLElement[] = [];
  currentIndex = 0;

  setTerm(term: string) {
    this.term$.next(term);
    this.currentIndex = 0;
  }

  clear() {
    this.term$.next('');
    this.matches.forEach(el => el.classList.remove('highlight', 'active-match'));
    this.matches = [];
    this.currentIndex = 0;
  }

  registerMatches(matches: HTMLElement[]) {
    this.matches.forEach(m => m.classList.remove('active-match'));
    this.matches = matches;
  }

  getCount() {
    return this.matches.length;
  }

  navigate(dir: 'up' | 'down') {
    if (!this.matches.length) return;
    this.matches[this.currentIndex].classList.remove('active-match');
    this.currentIndex = dir === 'down'
      ? (this.currentIndex + 1) % this.matches.length
      : (this.currentIndex - 1 + this.matches.length) % this.matches.length;

    const el = this.matches[this.currentIndex];
    el.classList.add('active-match');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
/////////////////////
@Component({
  selector: 'app-accordion-group',
  templateUrl: './accordion-group.component.html',
  styleUrls: ['./accordion-group.component.css'],
})
export class AccordionGroupComponent implements OnInit {
  @Input() data: { head: string; body: string; expanded?: boolean }[] = [];
  @ViewChild('container') container!: ElementRef;

  constructor(private search: SearchService) {}

  ngOnInit() {
    this.search.searchTerm$.subscribe(term => {
      this.clearHighlights();
      this.data.forEach(d => d.expanded = false);
      if (!term) return;

      setTimeout(() => {
        const matches: HTMLElement[] = [];
        const elems = this.container.nativeElement.querySelectorAll('.searchable');

        elems.forEach((el: HTMLElement) => {
          const txt = el.innerText;
          const regex = new RegExp(`(${term})`, 'gi');
          if (regex.test(txt)) {
            el.innerHTML = txt.replace(regex, '<span class="highlight">$1</span>');
            const parent = el.closest('.accordion');
            if (parent) {
              const idx = parseInt(parent.getAttribute('data-index')!);
              this.data[idx].expanded = true;
            }
          }
        });

        setTimeout(() => {
          const highlights = this.container.nativeElement.querySelectorAll('.highlight');
          matches.push(...Array.from(highlights) as HTMLElement[]);
          this.search.registerMatches(matches);
        });
      });
    });
  }

  clearHighlights() {
    const highlights = this.container?.nativeElement.querySelectorAll('.highlight');
    highlights?.forEach((el: HTMLElement) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.innerText), el);
        parent.normalize();
      }
    });
  }

  toggle(i: number) {
    this.data[i].expanded = !this.data[i].expanded;
  }
}
//////////////////////
<div #container>
  <div class="accordion" *ngFor="let item of data; let i = index"
       [attr.data-index]="i" [class.expanded]="item.expanded">
    <div class="accordion-header" (click)="toggle(i)">
      <div class="searchable">{{ item.head }}</div>
    </div>
    <div class="accordion-body" *ngIf="item.expanded">
      <div class="searchable">{{ item.body }}</div>
    </div>
  </div>
</div>
//////////////////
@NgModule({
  declarations: [AccordionGroupComponent],
  imports: [CommonModule],
  exports: [AccordionGroupComponent]
})
export class AccordionGroupModule {}
/////////////////////
export class ComponentAComponent {
  searchText = '';
  currentIndex = 0;

  dataA = [
    { head: 'First A', body: 'This is A body one.' },
    { head: 'Another A', body: 'Something head and body here too.' }
  ];

  constructor(public search: SearchService) {}

  onSearch() {
    this.search.setTerm(this.searchText);
  }

  clear() {
    this.searchText = '';
    this.search.clear();
  }

  navigate(dir: 'up' | 'down') {
    this.search.navigate(dir);
    this.currentIndex = this.search.currentIndex;
  }

  getCount() {
    return this.search.getCount();
  }
}
//////////////////
<div class="search-bar">
  <input [(ngModel)]="searchText" placeholder="Search..." />
  <button (click)="onSearch()">Search</button>
  <button (click)="navigate('up')">⬆️</button>
  <button (click)="navigate('down')">⬇️</button>
  <span *ngIf="getCount()">{{ currentIndex + 1 }} / {{ getCount() }}</span>
  <button (click)="clear()">Clear</button>
</div>

<app-accordion-group [data]="dataA"></app-accordion-group>
