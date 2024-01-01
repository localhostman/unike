import { IRes } from 'src/app/fw/interfaces/i-res';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductPropService } from 'src/app/services/product-prop.service';
import { AddressService } from 'src/app/services/address.service';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { IAddress, ICart, IOrder, IProductProp, IOrderProduct, IPromo, IPaymentMethod, ICartRef } from 'src/app/interfaces/i-data';
import { IOrderProductRef, OrderService } from 'src/app/services/order.service';
import { PaymentExtension } from 'src/app/extensions/payment';
import { ModalController } from '@ionic/angular';
import { OrderDetailPage } from '../order-detail/order-detail.page';
import { Utility } from 'src/app/fw/utils/utility';
import { PromoService } from 'src/app/services/promo.service';
import { PromoExtension } from 'src/app/extensions/promo';
import { PaymentMethodService } from 'src/app/services/payment-method.service';
import { SelectGiftPage } from '../select-gift/select-gift.page';
import { GiftService } from 'src/app/services/gift.service';
import { AddressPage } from 'src/app/pages/address/address.page';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { CouponPage } from 'src/app/pages/coupon/coupon.page';

@Component({
  selector: 'app-send-order',
  templateUrl: './send-order.page.html',
  styleUrls: ['./send-order.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SendOrderPage extends CompBase implements AfterViewInit {

  @Input() selecteds?: ICartRef;

  address?: IAddress;
  phone!: string;

  private _cartRef!: ICartRef;
  carts!: ICart[];

  gifts!: ICart[];
  giftNum!: number;

  note?: string;
  exchangeRate!: number;

  vCarts!: ICart[];
  vAmount!: number;

  nvCarts!: ICart[];
  nvAmount!: number;

  totalQuantity!: number;
  totalWeight!: number;

  enableSendOrder!: boolean;
  amount!: number;
  diffAmount!: number;
  transportFare!: number;

  amountToPay!: number;
  amountToPayExchanged!: number;

  paymentMethods!: IPaymentMethod[];

  @ViewChild("promoCode") promoCodeEl!: ElementRef;

  constructor(
    public resizeExt: ResizeExtension,
    public dExt: DeliveryExtension,
    public pExt: PaymentExtension,
    public mExt: PromoExtension,
    private giftService: GiftService,
    private orderService: OrderService,
    private promoService: PromoService,
    private addressService: AddressService,
    private paymentMethodService: PaymentMethodService,
    private productPropService: ProductPropService,
    private productService: ProductService,
    private service: CartService,
    public modalCtrl: ModalController,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.pushState();

    this.exchangeRate = this.envExt.exchangeRate;
    this.pExt.initialize();

    await this.loadingService.run(async () => {
      this.paymentMethods = (await this.paymentMethodService.getData())!;

      try {
        await this._reload();
        this._generateSum();
      } catch (e) { }

      if (this.giftNum) {
        this.giftService.init(this.giftNum);
        const modal = await this.createModal({
          cssClass: "modal-t3",
          backdropDismiss: false,
          component: SelectGiftPage,
          componentProps: {
            num: this.giftNum
          }
        });

        modal.onDidDismiss().then(({ data }) => {
          if (data) {
            this.gifts = data;
            this.cdRef.detectChanges();
          }
          else if (!this.gifts?.length) {
            this.getModalCtrl().dismiss();
          }
        });

        await modal.present();
      }

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));

    this.subscription.add(this.pExt.update$.subscribe(() => {
      this.cdRef.detectChanges();
    }));

    this.subscription.add(this.addressService.update$.subscribe((address: IAddress) => {
      if (address.id == this.address?.id) {
        this.address = address;
        this.cdRef.detectChanges();
      }
    }));

    this.subscription.add(this.addressService.remove$.subscribe((address: IAddress) => {
      if (address.id == this.address?.id) {
        this.address = undefined;
        this.cdRef.detectChanges();
      }
    }));
  }

  async onClose() {
    return await this.modalCtrl.dismiss();
  }

  async onGotoAddress() {
    const modal = await this.createModal({
      component: AddressPage,
      cssClass: 'modal-t1',
      componentProps: {
        modalMode: true
      }
    });

    modal.onWillDismiss().then(({ data }) => {
      if (data) {
        this.address = data;
        this.cdRef.detectChanges();
      }
    });

    await modal.present();
  }

  async onSelectPaymentMethod() {
    await this.pExt.select();
  }

  async onChangePromoCode() {
    const value = this.promoCodeEl.nativeElement.value.trim();
    if (!value) {
      this.getMessageExt().alert(this.lang("Inserisci il codice"));
      return;
    }

    await this.loadingService.run(async () => {

      const res = await this.promoService.getAllByExtra(value, this.vAmount);
      const topics: IPromo[] = res?.topics ?? [];
      this.mExt.extras = topics;
      this._generateSum();
      this.cdRef.detectChanges();

      if (!topics.length) {
        this.getMessageExt().alert(this.lang("Il codice promozionale non valido"));
      }
    });
  }

  async onSelectPromo() {
    const modal = await this.createModal({
      component: CouponPage,
      cssClass: 'modal-t1',
      componentProps: {
        modalMode: true,
        selecteds: this.mExt.extras,
        data: this.mExt.usables
      }
    });

    modal.onWillDismiss().then(({ data }) => {
      if (data) {
        this.mExt.extras = data;
        this._generateSum();
        this.cdRef.detectChanges();
      }
    });

    await modal.present();
  }

  private async _reload() {
    if (!this.isLogin)
      return false;

    let res1: IRes | undefined, res2: IRes | undefined, res3: IRes | undefined;
    let props: any;
    let autoGetsPromos: IPromo[];
    let usablePromos: IPromo[];

    const oldCarts = this.selecteds ?? this.service.getCarts();

    [res1, res2, res3] = await Promise.all(
      [
        this.productService.getCarts({
          Carts: oldCarts
        }, { ignoreCheckRes: true }),
        this.addressService.getDefault(),
        this.promoService.getUsable()
      ]
    );

    this.carts = res1?.topics ?? [];
    this.address = res2?.topics;

    [autoGetsPromos, usablePromos] = res3?.topics ?? [[], []];

    this.vCarts = [];
    this.vAmount = 0;
    this.nvCarts = [];
    this.nvAmount = 0;
    this.amount = 0;
    this.totalQuantity = 0;
    this.totalWeight = 0;

    let giftNum = 0;

    const giftTreshold = this.envExt.giftThreshold;

    [, props] = res1?.extra ?? [undefined, undefined];
    const [cartRef, removeds] = this.service.diffCarts(this.carts, oldCarts, this.dExt.deliveryMethod, (item: ICart) => {
      const total = item.Total!;
      if (item.ValuableMoaFinal) {
        this.vCarts.push(item);
        this.vAmount += total;
      }
      else {
        this.nvCarts.push(item);
        this.nvAmount += total;
      }

      const quantity = item.Quantity!;
      this.amount += total;
      this.totalQuantity += quantity;
      this.totalWeight += quantity * (item.Weight || 0);

      if (giftTreshold && item.AddGift) {
        giftNum += Math.floor(quantity / giftTreshold);
      }
    });

    this.resetProps(props);

    this.note = this.orderService.getNote();

    this._cartRef = cartRef;
    this.giftNum = giftNum;

    [this.enableSendOrder, this.transportFare, this.diffAmount] = await this.dExt.getSum(this.vAmount, this.totalWeight);
    this.mExt.inizialize(autoGetsPromos, usablePromos, this.dExt.amount);

    if (removeds.length) {
      let msg = "";
      removeds.forEach((item) => {
        msg += `${item.Name}${item.Note ? " [" + item.Note + "]" : ""}\n`;
      });

      if (msg) {
        this.getMessageExt().alert({
          subHeader: this.lang("I seguenti prodotti sono stati rimossi per non disponiblità"),
          message: msg
        });
      }
    }

    return true;
  }

  onCheckout() {
    if (this.dExt.needAddress) {
      if (!this.address) {
        this.getMessageExt().confirm({
          header: this.lang('Indirizzo assente'),
          message: this.lang('Seleziona l\'indirizzo di consegna'),
          successText: this.lang('Seleziona'),
          cancelText: this.lang('Annulla'),
          success: () => {
            this.onGotoAddress();
          }
        });

        return;
      }
    }
    else if (!this.phone) {
      this.getMessageExt().alert(this.lang("Scrive il telefono di contatto"));
      return;
    }

    this.getMessageExt().confirm({
      message: this.lang("Fare clic su 'Conferma' per confermare e inviare l'ordine"),
      success: async () => {
        const address: number = this.address?.id;

        if (this.carts.length == 0) {
          this.getMessageExt().alert('Il carrello è ancora vuoto, seleziona almeno un articolo');
          return;
        }

        const res = await this.loadingService.run(() => {
          const paymentMethodId = this.pExt.paymentMethod.id;

          return this.orderService.update(0, {
            LocalId: Date.now(),
            DeliveryMethodId: this.dExt.deliveryMethod.id,
            PaymentMethodId: paymentMethodId,
            TradeType: Utility.getBrowser().versions.mobile ? 'JSAPI' : 'NATIVE',
            Address: address,
            Phone: this.phone,
            PromoIds: this.mExt.ids,
            CNote: this.note,
            Carts: this._cartRef,
            Gifts: this.gifts
          });
        });

        const topic: IOrder = res?.topics;
        if (!topic)
          return;

        let orderProducts: IOrderProduct[] = topic.Products;

        let msg: string = res.msg;
        let [, props, payInfo] = res.extra;

        try {
          await this.pExt.pay(topic, payInfo);
          this.updateProducts(orderProducts);
          let modal: HTMLIonModalElement | undefined;

          do {
            modal = await this.modalCtrl.getTop();
            if (!!modal)
              await modal.dismiss();

          } while (!!modal);

          this.dExt.update();

          this.getMessageExt().confirm({
            header: this.lang('Ordine con successo'),
            message: msg,
            cancelText: this.lang('OK'),
            successText: this.lang('Dettagli ordine'),
            success: async () => {
              const modal = await this.createModal({
                component: OrderDetailPage,
                cssClass: 'modal-t3',
                componentProps: {
                  orderId: topic.idno
                }
              });

              await modal.present();
            }
          });
        } catch (e) {
          await this.resetProps(props);
        }
      }
    });
  }

  private async resetProps(props: { [key: string]: IProductProp } | boolean) {
    if (typeof (props) == "object" && Object.keys(props).length > 0) {
      this.productPropService.setData(props);
    }
  }

  private updateProducts(carts: ICart[]) {
    const opRef: IOrderProductRef = {};

    let tmp: number;
    carts.forEach((item: ICart) => {
      tmp = item.Quantity!;
      const idno = item.idno!;

      if (!opRef[idno])
        opRef[idno] = {
          qt: 0,
          propQt: []
        };

      opRef[idno].qt += tmp;
      opRef[idno].propQt.push({
        propIdno: item.PropIdno,
        qt: tmp
      });
    });

    this.service.diffCarts([], this._cartRef, this.dExt.deliveryMethod);

    this.orderService.save$.next(opRef);
  }

  private _generateSum() {
    let percentDiscount = 0;
    let discount = 0;
    let dd = this.dExt.discount ?? 0;

    if (dd < 1) {
      percentDiscount = dd;
    }
    else
      discount = dd;

    [percentDiscount, discount] = this.mExt.getSum(percentDiscount, discount);

    const amount = this.amount - discount - this.amount * percentDiscount;

    this.amountToPay = amount + this.transportFare;
    this.amountToPayExchanged = this.amountToPay * this.exchangeRate;
  }

}
