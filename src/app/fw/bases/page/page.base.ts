import { ChangeDetectorRef, Directive, Injector, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonContent } from '@ionic/angular';
import { CompBase } from '../comp/comp.base';

@Directive()
export abstract class PageBase extends CompBase {

  data: any[] = [];
  protected ref: any = {};

  page: number = 1;
  pageSize: number = 9999;
  count: number = 0;
  loadedAll: boolean = false;

  @ViewChild("content", { static: true }) content!: IonContent;
  // @ViewChild(CdkVirtualScrollViewport, { static: true }) scrollEl!: CdkVirtualScrollViewport;
  @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

  constructor(
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef,
  ) {
    super(injector, cdRef);
  }

  protected reset() {
    this.loadedAll = false;
    this.data = [];
    this.ref = {};
  }

  protected isInfiniteScroll() {
    return this.infiniteScroll && !this.infiniteScroll.disabled;
  }

  protected getLastPage(offset: number) {
    return Math.ceil((this.count + offset) / this.pageSize);
  }

  protected async contentScrollToTop() {
    // this.scrollEl?.scrollTo({ top: 0 });
    await this.content.scrollToTop(0);
  }

  async onChangePage(page: number, reset: boolean = false) {
    this.cdRef.detach();
    this.page = page;
    this.cdRef.detectChanges();

    if (this.isInfiniteScroll()) {
      await this.paging(reset);
      this.infiniteScroll?.complete();

      this.cdRef.detectChanges();
      this.cdRef.reattach();
    }
    else {
      await this.loadingService.run(async () => {
        await this.paging(reset);

        this.cdRef.detectChanges();
        this.cdRef.reattach();

        await this.contentScrollToTop();
      });
    }
  }

  protected abstract paging(reset?: boolean): Promise<void>;
}
