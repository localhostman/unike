import { CartService } from 'src/app/services/cart.service';
import { ProductExtension } from 'src/app/extensions/product';
import { ProductPropComponent } from '../../components/product-prop/product-prop.component';
import { Component, Input, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Injector, ViewChild } from '@angular/core';
import { IProduct, IProductProp, ICart } from 'src/app/interfaces/i-data';
import { ProductPropService } from 'src/app/services/product-prop.service';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { DeliveryExtension } from 'src/app/extensions/delivery';

@Component({
  selector: 'app-product-prop',
  templateUrl: './product-prop.page.html',
  styleUrls: ['./product-prop.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPropPage extends CompBase implements AfterViewInit {

  @Input() data!: IProduct;

  props!: { [key: string]: IProductProp };
  lastCart!: ICart;
  imgPath!: string;
  @ViewChild(ProductPropComponent) productPropEl!: ProductPropComponent;

  constructor(
    public dExt: DeliveryExtension,
    public productExt: ProductExtension,
    public cartService: CartService,
    protected service: ProductPropService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.pushState();

    this.props = await this.service.getData();

    this.visible = true;
    this.cdRef.detectChanges();

    this.subscription.add(this.cartService.update$.subscribe(({ product }) => {
      if (product?.id == this.data.id)
        this.productPropEl.refresh();
    }));
  }

  onClose() {
    return this.close();
  }

  async close() {
    await this.getModalCtrl().dismiss();
  }

  onChangeProp({ lastCart, imgPath = null }: any) {
    this.lastCart = lastCart;
    if (!imgPath)
      this.imgPath = imgPath;
    this.cdRef.detectChanges();
  }

  onInsertQuantity() {
    this.getMessageExt().prompt({
      message: this.lang("请输入数量"),
      inputs: [{ type: "number", name: "val", value: this.lastCart.Quantity }],
      success: ({ val }: any) => {
        val = parseInt(val);
        if (isNaN(val))
          return;

        this.onChangeQuantity(val - this.lastCart.Quantity!);
      }
    });
  }

  onChangeQuantity(qt: number) {
    this.productPropEl.changeQuantity(qt);
  }

}