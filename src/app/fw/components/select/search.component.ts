import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, AfterViewInit {
  @Input() q = "";
  @Input() placeholder = "Parole chiavi..";
  @Output() wzzSearch: EventEmitter<string> = new EventEmitter<string>();

  inputWidth!: number;

  @ViewChild("inputEl") inputEl!: ElementRef;

  constructor(
    protected cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputEl.nativeElement.focus();
    }, 100);
  }

  onSearch(event: any) {
    this.q = (event.target.value).trim();
    this.wzzSearch.next(this.q);
  }
}
