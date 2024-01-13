import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { IDeliveryMethod } from 'src/app/interfaces/i-data';

@Component({
  selector: 'app-shipping-rule',
  templateUrl: './shipping-rule.page.html',
  styleUrls: ['./shipping-rule.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShippingRulePage extends PageBase implements AfterViewInit {

  d?: IDeliveryMethod;

  constructor(
    public resizeExt: ResizeExtension,
    public routerLinkExt: RouterLinkExtension,
    public dExt: DeliveryExtension,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    this.d = this.dExt.deliveryMethod;

    this.visible = true;
    this.cdRef.detectChanges();

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  protected async paging(reset: boolean = false) {
  }

}
