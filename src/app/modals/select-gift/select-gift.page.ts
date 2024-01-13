import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { ProductExtension } from 'src/app/extensions/product';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { GiftPage } from 'src/app/pages/gift/gift.page';
import { ProductService } from 'src/app/services/product.service';
import { GiftService } from 'src/app/services/gift.service';

@Component({
  selector: 'app-select-gift',
  templateUrl: './select-gift.page.html',
  styleUrls: ['./select-gift.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectGiftPage extends GiftPage {

  @Input() num: number = 0;

  constructor(
    public override dExt: DeliveryExtension,
    public override routerLinkExt: RouterLinkExtension,
    public override resizeExt: ResizeExtension,
    public override productExt: ProductExtension,
    protected giftService: GiftService,
    protected override service: ProductService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(dExt, routerLinkExt, resizeExt, productExt, service, router, route, injector, cdRef);
  }

  onClose() {
    this.getModalCtrl().dismiss();
  }

  get proNumRef() {
    return this.giftService.getProNumRef();
  }

  onUpdate() {
    this.cdRef.detectChanges();
  }

  async onSubmit() {
    const data = await this.giftService.getData();
    const actNum = this.giftService.actNum;
    if (this.giftService.actNum != this.num) {
      this.getMessageExt().alert(this.lang(
        "Ci sono un totale di N1 omaggi tra cui scegliere, e tu hai già scelto N2 omaggi",
        { n1: this.num, n2: actNum }
      ));

      return;
    }
    this.getModalCtrl().dismiss(data);
  }

}
