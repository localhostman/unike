import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy, OnDestroy, Injector } from '@angular/core';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { ScriptLoaderService } from 'src/app/fw/services/script-loader.service';
import { OrderService } from 'src/app/services/order.service';
import { IPaymentMethod, IOrder } from 'src/app/interfaces/i-data';
import { PAYMENT_METHOD } from 'src/app/const/const';
import { ModalController } from '@ionic/angular';

declare var paypal: any;

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.page.html',
  styleUrls: ['./payment-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentModalPage extends CompBase implements OnInit, OnDestroy {
  @Input() order!: IOrder;
  @Input() paymentMethod!: IPaymentMethod;
  @Input() payInfo: any;
  paymentMethods = PAYMENT_METHOD;

  private _maxLifeTime: number = 0;

  constructor(
    private scriptLoaderService: ScriptLoaderService,
    private orderService: OrderService,
    private modalCtrl: ModalController,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngOnInit() {
    try {
      switch (this.paymentMethod.TypeId) {
        case PAYMENT_METHOD.WX_PAY:
          this._maxLifeTime = 300;
          break;
        case PAYMENT_METHOD.PAYPAL:
          this._maxLifeTime = 10800;
          break;
      }

      let ct: number = 0;
      let tid = setInterval(() => {
        ct++;
        if (ct > this._maxLifeTime) {
          clearInterval(tid);
          this.modalCtrl.dismiss(false);
          this.getMessageExt().alert(this.lang("支付超时, 请重新提交订单"));
        }
      }, 1000);

      switch (this.paymentMethod.TypeId) {
        case PAYMENT_METHOD.PAYPAL:
          await this.paypal();
          break;
      }

      this.modalCtrl.dismiss(true);
    } catch (e) {
      this.modalCtrl.dismiss(false);
    }
  }

  onClose() {
    this.getMessageExt().confirm({
      message: this.lang("您正在退出支付界面"),
      successText: this.lang("退出"),
      cancelText: this.lang("继续支付"),
      success: () => {
        this.modalCtrl.dismiss(false);
      }
    });

  }

  override ngOnDestroy() {
  }

  onClickWxpay() {
    window.open(this.payInfo.mweb_url);
  }

  private paypal() {
    return new Promise(async (resolve, reject) => {
      const loading = await this.loadingService.start();
      try {
        await this.scriptLoaderService.load([`https://www.paypal.com/sdk/js?client-id=${this.payInfo.ClientId}&currency=EUR`]);

        let tid = setTimeout(() => {
          clearTimeout(tid);
          this.visible = true;
          this.cdRef.detectChanges();
          this.loadingService.end(loading);

          paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              // Set up the transaction
              return Promise.resolve(this.payInfo.id);
            },
            onApprove: async (data: any, actions: any) => {
              // Capture the funds from the transaction
              return this.orderService.paypalCapture({ id: data.orderID }).then((topics) => {
                resolve(true);
              });
            },
          }).render("#paypal-btn");
        }, 1000);
      } catch (e) {
        this.loadingService.end(loading);
        console.log("script fail loading");
        reject();
      }
    });

  }
}
