import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { IDeliveryMethod } from 'src/app/interfaces/i-data';
import { Animations } from 'src/app/utils/animations';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    Animations.accordionInit,
    Animations.accordionOpenClose
  ]
})
export class FaqPage extends PageBase implements AfterViewInit {

  override data: boolean[] = [
    true,
    true,
    true,
    true,
    true
  ];

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
