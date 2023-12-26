import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Input, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { FORM_INVALID_MSG, SUCCESS_MESSAGE } from 'src/app/fw/const/const';
import { IOrder, IOrderProduct, IProduct } from 'src/app/interfaces/i-data';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-return-detail',
  templateUrl: './return-detail.page.html',
  styleUrls: ['./return-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnDetailPage extends CompBase implements AfterViewInit {

  @Input() orderId!: string;
  data!: IOrder;
  products!: IOrderProduct[];
  return: any = {};
  showShippingModal = false;

  form: FormGroup;

  constructor(
    private service: OrderService,
    private _fb: FormBuilder,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);

    this.form = this._fb.group({
      "ShippingMethod": [null, [Validators.required]],
      "ShippingTrackingNumber": [null, [Validators.required]],
    });
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

  async onSubmitShipping() {
    if (this.form.invalid) {
      this.getMessageExt().alert(this.lang(FORM_INVALID_MSG));
      return;
    }

    const data = this.form.getRawValue();
    await this.loadingService.run(async () => {
      if (await this.service.updateReturnShipping(this.orderId, data)) {
        await this.getMessageExt().toast(this.lang(SUCCESS_MESSAGE));
        this.showShippingModal = false;
        this.cdRef.detectChanges();
      }
    });
  }

  private async _reload() {
    if (!this.isLogin)
      return;

    const res = await this.service.getOne(0, { idno: this.orderId }, { ignoreCheckRes: true });
    this.data = res?.topics ?? {};
    this.products = (this.data.Products ?? []).filter(item => {
      return item.RefundQuantity;
    });

    this.return = this.data.Return ?? {};

    this.form.patchValue(this.return);
  }

}
