import { Product } from './../../utils/product';
import { PRODUCT_PROP_SEPARATOR } from './../../const/const';
import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, Injector, AfterViewInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { IProduct, IProductProp, ICart } from 'src/app/interfaces/i-data';
import { Utility } from 'src/app/fw/utils/utility';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { CartService } from 'src/app/services/cart.service';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { PRODUCT_PROP_TYPE } from 'src/app/const/const';
import { DEFAULT_IMAGE } from 'src/app/fw/const/const';

const decodePropIdno = function (str: string) {
  return str.split(PRODUCT_PROP_SEPARATOR);
};

const encodePropIdno = function (arr: IProductProp[]) {
  return arr.map(item => item.idno).join(PRODUCT_PROP_SEPARATOR);
};

const getNewCart = function (product: IProduct, propGroup: IProductProp[], props: { [key: string]: IProductProp }) {
  const obj: ICart = Utility.clone(product);
  let price = obj.Price ?? 0;
  let note = "";
  obj.PropIdno = encodePropIdno(propGroup);
  obj.uniqueKey = Product.getKey(obj);

  propGroup.forEach(item => {
    const prop = props[item.idno!];
    if (prop) {
      price += item.Price!;
      note += prop.Name + ", ";
    }
  });

  obj.Price = price;
  obj.Note = note.substring(0, note.length - 2);
  obj.Quantity = 0;

  return obj;
};

const getPropStock = function (product: IProduct, propIdno: string) {
  const ss = product.PropStocks;

  if (ss) {
    let tmp = ss[propIdno];
    if (tmp)
      return tmp;
    return 0;
  }
  else {
    return product.Stock;
  }
}

const getPropImage = function (product: IProduct, propIdno: string, propGroup: IProductProp[]) {
  const d = product.ImageCount! > 0 ? product.OrigImage + ".jpg?" + product.ImageLTime : DEFAULT_IMAGE;
  const is = product.PropImages;
  if (is) {
    let tmp = is[propIdno];
    if (tmp)
      return tmp;

    propGroup.some(prop => {
      tmp = is[prop.idno!];
      return tmp;
    });
    return tmp ?? d;
  }
  else {
    return d;
  }
}

@Component({
  selector: 'product-prop',
  templateUrl: './product-prop.component.html',
  styleUrls: ['./product-prop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPropComponent extends CompBase implements OnChanges, AfterViewInit {

  @Input() product!: IProduct;
  @Input() ltime!: number;
  @Input() props!: { [key: string]: IProductProp };
  @Input() cartService!: CartService;
  @Input() parentCDRef!: ChangeDetectorRef;
  @Output() wzzChange = new EventEmitter<{ lastCart: ICart, imgPath?: string }>();

  showPropPrice!: boolean;
  propTypes = PRODUCT_PROP_TYPE;
  lastPropGroup!: IProductProp[];
  lastPropIdnoStr!: string;
  totalQuantity!: number;
  amount!: number;
  lastCart!: ICart;
  imgPath!: string;
  stock!: number;
  totalStock!: number;

  constructor(
    public dExt: DeliveryExtension,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
    cdRef.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdRef.detectChanges();
  }

  async ngAfterViewInit() {
    this.showPropPrice = this.envExt.showPropPrice;
    this.totalStock = this.product.Stock!;

    [this.totalQuantity, this.amount, this.lastCart] = this.cartService.getPropInfo(this.product);
    const productProps = this.product.Props ?? [];

    let lastPropIdnoStr: string;
    if (!!this.lastCart) {
      lastPropIdnoStr = this.lastCart.PropIdno!;
      const productPropIdno = decodePropIdno(lastPropIdnoStr);

      this.lastPropGroup = productProps.map((group: IProductProp, index: number) => {
        return group?.Children?.find(item => item.idno == productPropIdno[index]);
      });
    }
    else {
      this.lastPropGroup = productProps.map((group: IProductProp) => {
        const children = group.Children!;
        return children[0];
      });
      lastPropIdnoStr = encodePropIdno(this.lastPropGroup);
      this.lastCart = getNewCart(this.product, this.lastPropGroup, this.props);
    }

    this.imgPath = getPropImage(this.product, lastPropIdnoStr, this.lastPropGroup);
    this.stock = getPropStock(this.product, lastPropIdnoStr);

    this.visible = true;
    this.cdRef.detectChanges();

    this.wzzChange.next({ lastCart: this.lastCart, imgPath: this.imgPath });

    // this.subscription.add(this.eventsService.updateProductProp$.subscribe(({ product, qt, totalQuantity, amount }) => {
    //   if (this.lastCart.PropIdno == product.PropIdno) {
    //     this.lastCart.Quantity += qt;
    //   }

    //   this.totalQuantity = totalQuantity;
    //   this.amount = amount;

    //   this.cdRef.detectChanges();
    //   this.parentCDRef.detectChanges();
    // }));
  }

  refresh() {
    const carts = this.cartService.getCarts();
    const found = carts[this.lastCart?.uniqueKey!];
    this.lastCart.Quantity = found?.Quantity;
    this.parentCDRef.detectChanges();
  }

  onSelectProp(groupIndex: number, prop: IProductProp) {
    this.lastPropGroup[groupIndex] = prop;
    let productPropIdno = encodePropIdno(this.lastPropGroup);

    this.lastCart = this.cartService.getCartByProp(this.product.idno!, productPropIdno);
    if (!this.lastCart) {
      this.lastCart = getNewCart(this.product, this.lastPropGroup, this.props);
    }

    this.imgPath = getPropImage(this.product, productPropIdno, this.lastPropGroup);
    this.stock = getPropStock(this.product, productPropIdno);

    this.wzzChange.next({ lastCart: this.lastCart, imgPath: this.imgPath });

    this.cdRef.detectChanges();
    this.parentCDRef.detectChanges();
  }

  async changeQuantity(qt: number) {
    this.cartService.toCart(this.lastCart, qt, this.totalStock, true, this.imgPath, this.stock);
    this.dExt.update();

    this.parentCDRef.detectChanges();

    return this.lastCart;
  }

}
