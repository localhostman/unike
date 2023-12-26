import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

const PAGE_NUM = 5;

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnChanges, OnInit {
  @Input() totalPage!: number;
  @Input() count?: number;
  @Input() page!: number;
  @Input() pageSize!: number;

  @Output() change: EventEmitter<{ page: number }> = new EventEmitter<{ page: number }>();

  pages!: number[];

  constructor(
    protected cdRef: ChangeDetectorRef 
  ) { }

  ngOnInit() {

  }
  ngOnChanges() {
    this.generatePages();
  }
  private generatePages() {
    if (this.totalPage == undefined) {
      this.totalPage = Math.ceil((this.count ?? 0) / this.pageSize);
    }

    this.pages = [];
    let currentIndex: number;
    const interval = Math.floor(PAGE_NUM / 2);
    let exmax = Math.min(this.page + PAGE_NUM - 1, this.totalPage);
    let exmin = Math.max(this.page - PAGE_NUM + 2, 1);

    if (exmax - exmin + 1 < PAGE_NUM && exmin > 1)
      exmin--;
    for (let i = exmin; i <= exmax; i++) {
      this.pages.push(i);
    }

    currentIndex = Math.round(this.pages.length / 2);
    exmax = Math.min(currentIndex + interval, this.totalPage);
    exmin = Math.max(currentIndex - interval, 1);
    this.pages = this.pages.splice(exmin - 1, PAGE_NUM);

  }
  getFirst() {
    return this.pages[0];
  }
  getLast() {
    return this.pages[this.pages.length - 1];
  }
  onClickPage(page: number) {
    if (page == this.page)
      return;

    if (page >= 1 && page <= this.totalPage)
      this.change.emit({ page: page });
  }
}
