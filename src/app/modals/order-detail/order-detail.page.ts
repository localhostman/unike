import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Input, Injector } from '@angular/core';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { IOrder, IAddress, IOrderProduct } from 'src/app/interfaces/i-data';
import { OrderService } from 'src/app/services/order.service';
import { CreateReturnPage } from '../create-return/create-return.page';
import { ReturnDetailPage } from '../return-detail/return-detail.page';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailPage extends CompBase implements AfterViewInit {

  @Input() orderId!: string;
  data!: IOrder;
  address!: IAddress;
  products!: IOrderProduct[];

  constructor(
    private service: OrderService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.pushState();

    this.loadingService.run(async () => {
      await this._reload();
      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.subscription.add(this.addLoginStateChangeSubscription(() => {
      this.loadingService.run(async () => {
        await this._reload();

        this.cdRef.detectChanges();
      });
    }));
  }

  onClose() {
    this.getModalCtrl().dismiss(this.data);
  }

  async onCreateReturn() {
    const modal = await this.getModalCtrl().create({
      component: CreateReturnPage,
      cssClass: "modal-t1",
      componentProps: {
        orderId: this.data.idno
      }
    });

    modal.onWillDismiss().then(({ data }) => {
      if (data) {
        this.data.RefundAmount = data.RefundAmount;
        this.cdRef.detectChanges();
      }
    });

    await modal.present();
  }

  async onReturnDetail() {
    const modal = await this.getModalCtrl().create({
      component: ReturnDetailPage,
      cssClass: "modal-t3",
      componentProps: {
        orderId: this.data.idno
      }
    });

    await modal.present();
  }

  onTracking() {
    let shippingUrl = "";
    const trackingNumber = this.data.ShippingTrackingNumber;

    switch (this.data.ShippingMethod) {
      case "TNT":
        shippingUrl = "https://www.tnt.it/tracking/Tracking.do";
        break;
      case "FEDEX":
        shippingUrl = "https://www.fedex.com/it-it/tracking.html";
        break;
      case "DHL":
        shippingUrl = "https://www.dhl.com/it-it/home/tracciabilita.html?tracking-id=" + trackingNumber;
        break;
      case "SDA":
        shippingUrl = "https://www.sda.it/wps/portal/Servizi_online/dettaglio-spedizione?locale=it&tracing.letteraVettura=" + trackingNumber;
        break;
      case "UPS":
        shippingUrl = "https://www.ups.com/track?loc=it_IT&requester=ST/";
        break;
    }

    if (shippingUrl) {
      window.open(shippingUrl);
    }
  }

  private async _reload() {
    if (!this.isLogin)
      return;

    const res = await this.service.getOne(0, { idno: this.orderId }, { ignoreCheckRes: true });
    this.data = res?.topics ?? {};
    this.products = this.data.Products ?? [];

    this.address = JSON.parse(<string>this.data.TransportInfo);
  }

}
