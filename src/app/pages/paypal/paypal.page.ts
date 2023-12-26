import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Injector } from '@angular/core';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { ScriptLoaderService } from 'src/app/fw/services/script-loader.service';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.page.html',
  styleUrls: ['./paypal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaypalPage extends CompBase implements OnInit, OnDestroy {

  amount!: string;
  private _id!: string;
  private _clientId!: string;
  private _maxLifeTime!: number;

  constructor(
    private scriptLoaderService: ScriptLoaderService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngOnInit() {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this._id = queryParamMap.get("id")!;
    this._clientId = queryParamMap.get("clientId")!;
    this.amount = queryParamMap.get("amount")!;

    if (!this._id || !this._clientId || !this.amount) {
      this.getMessageExt().alert("params err");
      return;
    }

    this._maxLifeTime = 10800;

    let ct: number = 0;
    let tid = setInterval(() => {
      ct++;
      if (ct > this._maxLifeTime) {
        clearInterval(tid);
        window.close();
        this.getMessageExt().alert(this.lang("支付超时, 请重新提交订单"));
      }
    }, 1000);

    let res: boolean;

    res = await this.paypal();
    if (res)
      alert(1);
  }

  onClose() {
    this.getMessageExt().confirm({
      message: this.lang('您正在退出支付界面'),
      successText: this.lang('退出'),
      cancelText: this.lang('继续支付'),
      success: () => {
        window.close();
      }
    });
  }

  private paypal(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const loading = await this.loadingService.start(false);
      try {
        await this.scriptLoaderService.load([`https://www.paypal.com/sdk/js?client-id=${this._clientId}&currency=EUR`]);

        let tid = setTimeout(() => {
          clearTimeout(tid);
          this.visible = true;
          this.cdRef.detectChanges();
          this.loadingService.end(loading);

          paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              // Set up the transaction
              return Promise.resolve(this._id);
            },
            onApprove: async (data: any, actions: any) => {
              // Capture the funds from the transaction
              return this.orderService.paypalCapture({ id: data.orderID }).then((topics) => {
                resolve(true);
              })
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
