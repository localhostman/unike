import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { ResizeExtension } from '../../fw/extensions/resize';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Injector, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductExtension } from 'src/app/extensions/product';
import { IProduct } from 'src/app/interfaces/i-data';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { DeliveryExtension } from 'src/app/extensions/delivery';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.page.html',
  styleUrls: ['./gift.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftPage extends PageBase implements AfterViewInit {

  constructor(
    public dExt: DeliveryExtension,
    public routerLinkExt: RouterLinkExtension,
    public resizeExt: ResizeExtension,
    public productExt: ProductExtension,
    protected service: ProductService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    await this.loadingService.run(async () => {
      await this.reload();

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  protected async reload(reset?: boolean) {
    if (reset)
      this.reset();

    const res = await this.service.getGifts({}, { page: this.page, pageSize: this.pageSize });

    const data: IProduct[] = res?.topics ?? [];
    this.count = res?.totalCount ?? 0;
    this.ref = {};
    this.data = this.data.concat(data);

    this.productExt.normalize(data, this.dExt.deliveryMethod, this.ref);
  }

  protected async paging(reset: boolean = false) {
    await this.reload(reset);
    this.updateUrl({ page: this.page });
  }

  //@override
  protected updateUrl(params?: any) {
    this.router.navigateByUrl(this.routerLinkExt.normalize(
      this.router.createUrlTree([], { relativeTo: this.route }).toString(),
      Object.assign({
        page: this.page == 1 ? null : this.page
      }, params)
    ));
  }

}
