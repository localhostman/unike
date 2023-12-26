import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Input, Injector, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController } from '@ionic/angular';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { FORM_INVALID_MSG, SUCCESS_MESSAGE } from 'src/app/fw/const/const';
import { IOrder, IOrderProduct, IProduct } from 'src/app/interfaces/i-data';
import { OrderService } from 'src/app/services/order.service';
import { FIT_MODE, IMAGE_TYPE, ImageCrop } from 'src/app/utils/image-crop';
import Swiper from 'swiper';

@Component({
  selector: 'app-create-return',
  templateUrl: './create-return.page.html',
  styleUrls: ['./create-return.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateReturnPage extends CompBase implements AfterViewInit {

  @Input() orderId!: string;
  form: FormGroup;
  data!: IOrder;
  products!: IOrderProduct[];

  num: number = 0;
  quantity: number = 0;
  amount: number = 0;

  images: any[] = [];
  files: File[] = [];

  public b1SwiperEl?: Swiper;
  @ViewChild("b1SwiperRef") b1SwiperRef?: ElementRef;

  constructor(
    private service: OrderService,
    private asCtrl: ActionSheetController,
    private fb: FormBuilder,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);

    this.form = this.fb.group({
      "Reason": [null, Validators.required],
      "Note": [null]
    });
  }

  async ngAfterViewInit() {
    this.pushState();

    await this.loadingService.run(async () => {
      await this._reload();
      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.b1SwiperEl = this.b1SwiperRef?.nativeElement.swiper;
    this.b1SwiperEl!.allowTouchMove = false;

    this.subscription.add(this.addLoginStateChangeSubscription(() => {
      this.loadingService.run(async () => {
        await this._reload();

        this.cdRef.detectChanges();
      });
    }));
  }

  onClose() {
    this.getModalCtrl().dismiss();
  }

  onSwipeTo(index: number) {
    this.b1SwiperEl?.slideTo(index, 200);
  }

  async onAddImage(event: any) {
    const files: FileList = event.target.files;
    const len = files.length;

    for (let i = 0; i < len; i++) {
      let file: File = files.item(i)!;
      file = await ImageCrop.getCrop(file, 1024, 1024, IMAGE_TYPE.JPEG, FIT_MODE.COVER, false);

      this.files[this.images.length] = (file);
      this.images.push({ ImgPath: this.getSanitizer().bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file)) });
    }

    this.cdRef.detectChanges();
  }

  async onDoImage(index: number) {
    const as = await this.asCtrl.create({
      header: this.lang('Operazioni disponibili'),
      buttons: [
        {
          text: this.lang('删除'),
          handler: () => {
            this.files.splice(index, 1);
            this.images.splice(index, 1);

            this.cdRef.detectChanges();
          }
        },
        {
          text: this.lang('取消'),
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    as.present();
  }

  onChangeRefundQuantity(evt: any, item: IOrderProduct) {
    const target: HTMLInputElement = evt.target;
    let value = parseFloat(target.value);
    const quantity = item.Quantity!;

    if (isNaN(value))
      value = 0;
    else if (value > quantity)
      value = quantity;

    target.value = value.toString();
    item.RefundQuantity = value;

    this._normalize();
  }

  onSubmit() {
    if (this.form.invalid || !this.images.length) {
      this.getMessageExt().alert(this.lang(FORM_INVALID_MSG));
      return;
    }

    if (!this.quantity) {
      this.getMessageExt().alert(this.lang("Seleziona almeno un prodotto da restituire"));
      return;
    }

    const products: any[] = [];

    this.products.forEach((item: IOrderProduct) => {
      if (item.RefundQuantity) {
        products.push({ id: item.id, RefundQuantity: item.RefundQuantity });
      }
    });

    const data = Object.assign({ OrderId: this.data.idno, RefundAmount: this.amount, Images: this.images, Products: products }, this.form.getRawValue());

    this.loadingService.run(async () => {
      if (await this.service.updateReturn(data, { files: this.files })) {
        await this.getMessageExt().toast(this.lang(SUCCESS_MESSAGE));
        this.getModalCtrl().dismiss(data);
      }
    });
  }

  private async _reload() {
    if (!this.isLogin)
      return;

    const res = await this.service.getOne(0, { idno: this.orderId }, { ignoreCheckRes: true });
    this.data = res?.topics ?? {};
    this.products = this.data.Products ?? [];

    this.products.forEach((item) => {
      item.FinalPrice = item.Price! * (1 - item.Discount!);
    });
  }

  private _normalize() {
    let amount = 0;
    let num = 0;
    let quantity = 0;
    this.products.forEach(item => {
      const refundQuantity = item.RefundQuantity!;
      if (refundQuantity) {
        num++;
        quantity += refundQuantity;
        amount += item.FinalPrice! * refundQuantity;
      }
    });

    this.num = num;
    this.quantity = quantity;
    this.amount = amount;
  }

}
