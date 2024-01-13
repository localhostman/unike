import { SendOrderPage } from '../../modals/send-order/send-order.page';
import { Injector } from '@angular/core';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ICart } from 'src/app/interfaces/i-data';
import { CartService } from 'src/app/services/cart.service';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { ResizeExtension } from 'src/app/fw/extensions/resize';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPage extends CompBase implements AfterViewInit {

  data!: ICart[];

  constructor(
    public resizeExt: ResizeExtension,
    public dExt: DeliveryExtension,
    protected service: CartService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    [this.data] = await Promise.all([
      this.service.getData()
    ]);

    this.visible = true;
    this.cdRef.detectChanges();

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  onInsertQuantity(item: ICart) {
    const quantity = item.Quantity!;
    this.getMessageExt().prompt({
      message: this.lang("请输入数量"),
      inputs: [{ type: "number", name: "val", value: quantity }],
      success: async ({ val }: any) => {
        val = parseInt(val);
        if (isNaN(val))
          return;

        this.service.toCart(item, val - quantity, undefined, true, undefined, item.Stock);
        await this.dExt.update();

        this.cdRef.detectChanges();
      }
    });
  }

  async onChangeQuantity(item: ICart, qt: number) {
    this.service.toCart(item, qt, undefined, true, undefined, item.Stock);

    await this.dExt.update();
    this.cdRef.detectChanges();
  }

  async onRemove(item: ICart) {
    this.getMessageExt().confirm({
      message: this.lang("Stai eliminando prodotto dal tuo carrello"),
      success: () => {
        this.onChangeQuantity(item, -item.Quantity!);
      }
    });
  }

  onClearAll() {
    this.getMessageExt().confirm({
      header: this.lang('Tip'),
      message: this.lang('您将清空购物车的所有商品'),
      success: async () => {
        this.service.clear();
        await this.dExt.update();
        this.getMessageExt().toast(this.lang("购物车已清空"));
      }
    });
  }

  async onCheckout() {
    if (!this.dExt.oAmount) {
      this.getMessageExt().alert(this.lang("Carrello vuoto"));
      return;
    }

    if (!this.envExt.isLogin()) {
      this.eventsService.login$.next();
      return;
    }

    const modal = await this.createModal({
      component: SendOrderPage,
      cssClass: 'modal-t2'
    });

    modal.onWillDismiss().then(async () => {
      [this.data] = await Promise.all([
        this.service.getData()
      ]);

      this.cdRef.detectChanges();
    });

    modal.present();
  }
}
