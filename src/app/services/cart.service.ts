import { TranslateService } from '@ngx-translate/core';
import { Product } from './../utils/product';
import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IProduct, ICart, IDeliveryMethod, ICartRef } from '../interfaces/i-data';
import { WzzStorage } from '../fw/utils/wzz-storage';
import { Utility } from '../fw/utils/utility';
import { Subject } from 'rxjs';

const STORAGE_KEY = "carts";

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseService {

  private totalQuantity: number = 0;
  private amount: number = 0;
  private oAmount: number = 0;
  private vAmount: number = 0;
  private totalWeight: number = 0;
  protected override data: ICart[] = [];

  private carts: ICartRef = {};
  protected proNumRef: { [key: string]: number } = {};

  update$ = new Subject<{ product: IProduct, qt?: number }>();
  clear$ = new Subject<void>();

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected translateService: TranslateService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
  }

  getDataFromStorage() {
    return WzzStorage.get(STORAGE_KEY);
  };

  setCarts(data: ICart[], d: IDeliveryMethod, callback?: Function) {
    const carts: any = {};
    const proNumRef: any = {};

    data.forEach((item: ICart) => {
      const idno = item.idno!;
      const key = Product.getKey(item);
      const quantity = item.Quantity;

      Product.generateTotal(item);

      item.uniqueKey = key;
      item.ValuableMoaFinal = Product.isValuableMoa(item, d);

      carts[key] = {
        idno: idno,
        PropIdno: item.PropIdno,
        Quantity: quantity,
        Timestamp: item.Timestamp
      };

      proNumRef[idno] = (proNumRef[idno] ?? 0) + quantity;

      if (callback) {
        callback(item);
      }
    });

    const removeds: ICart[] = [];
    this.data?.forEach(item => {
      if (!carts[item.uniqueKey!]) {
        removeds.push(item);
      }
    });

    super.setData(data);

    this.carts = carts;
    this.proNumRef = proNumRef;

    WzzStorage.set(STORAGE_KEY, carts);

    this.generateSum();

    return removeds;
  }

  getCarts() {
    return this.carts;
  };

  getProNumRef() {
    return this.proNumRef;
  }

  getDataByProductIdno(idno: string) {
    return Utility.clone(this.data.filter((item: ICart) => item.idno == idno && item.Quantity! > 0));
  }

  diffCarts(news: ICart[], oldRef: ICartRef, d: IDeliveryMethod, callback?: Function): [ICartRef, ICart[]] {
    const newRef: ICartRef = {};
    news.forEach(item => {
      newRef[Product.getKey(item)] = item;
    });

    const removeds = [];
    let i1 = 0, i2 = 0;
    let len = this.data.length;

    do {
      const item = this.data[i2];

      const idno = item.idno!;
      const key = item.uniqueKey!;
      const oldItem = oldRef[key];
      const newItem = newRef[key];
      const qt1 = oldItem?.Quantity ?? 0;
      const qt2 = newItem?.Quantity ?? 0;

      let offset = 1;

      if (oldItem) {
        if (qt2) {
          if (qt1 != qt2) {
            item.Quantity = qt2;
            this.carts[key].Quantity = qt2;
            Product.generateTotal(item);
            item.ValuableMoaFinal = Product.isValuableMoa(item, d);
          }

          if (callback) {
            console.log(item);
            callback(item);
          }
        }
        else {
          offset = 0;
          this.data.splice(i2, 1);
          delete this.carts[key];
          removeds.push(item);
        }
      }

      this.proNumRef[idno] = (this.proNumRef[idno] ?? 0) + (qt2 - qt1);

      i1++;
      i2 += offset;
    } while (i1 < len);

    WzzStorage.set(STORAGE_KEY, this.carts);

    this.generateSum();

    return [newRef, removeds];
  }

  removeDataByProductIdno(product: IProduct) {
    const idno = product.idno!;
    let ct: number = 0;
    let item: ICart;

    do {
      item = this.data[ct];
      if (idno == item.idno) {
        const key = item.uniqueKey!;
        this.data.splice(ct, 1);
        delete this.carts[key];
      } else {
        ct++;
      }
    } while (ct < this.data.length);

    this.proNumRef[idno] = 0;

    WzzStorage.set(STORAGE_KEY, this.carts);
    this.generateSum();

    this.update$.next({ product });
  }

  getPropInfo(product: IProduct) {
    let totalQuantity: number = 0;
    let amount: number = 0;
    let last: ICart | undefined = undefined;
    let oldTimestamp: number = 0;
    let newTimestamp: number = 0;

    this.data.forEach((item: ICart) => {
      const quantity = item.Quantity!;
      if (quantity > 0 && product.idno == item.idno) {
        totalQuantity += quantity;
        amount += item.Total!;
        newTimestamp = item.Timestamp!;
        if (!last || oldTimestamp < newTimestamp) {
          last = item;
          oldTimestamp = newTimestamp;
        }
      }
    });

    return [totalQuantity, amount, Utility.clone(last)];
  };

  getCartByProp(productIdno: string, propIdno: string) {
    return Utility.clone(this.data.find((item: ICart) => item.idno == productIdno && item.PropIdno == propIdno));
  }

  toCart(product: IProduct, qt: number, totalStock?: number, emitEvent: boolean = true, imgPath?: string, propStock?: number) {
    const idno = product.idno!;
    const key = Product.getKey(product);

    const foundIndex: number = this.data.findIndex(item => item.uniqueKey == key);
    const totQt: number = this.proNumRef[idno] ?? 0;

    const timestamp: number = Date.now();
    let res: number | boolean | undefined;
    let newTotQt: number = 0;

    if (foundIndex == -1) {
      let maxOrderProductCount = this.envExt.maxOrderProductCount;
      if (Product.reachMaxOrderProduct(maxOrderProductCount, this.data)) {
        this.eventsService.showAlert$.next(this.translateService.instant('非常抱歉, 商品种类已达上限(N种), 您无法再添加新的商品', { n: maxOrderProductCount }));
        return 0;
      }

      const maxNumPerOrder = product.MaxNumPerOrder!;
      res = Product.reachMaxNumPerOrder(product, totQt + qt, maxNumPerOrder);
      if (res === true) {
        this.eventsService.showAlert$.next(this.translateService.instant('此产品每单限订N件, 您已到达上限', { n: maxNumPerOrder }));
        return 0;
      }
      else {
        newTotQt = res;
        qt = Math.min(newTotQt - totQt, qt);
      }

      res = Product.reachStock(product, totQt + qt, propStock != undefined ? totQt + propStock : undefined, totalStock);

      if (res === true) {
        this.eventsService.showAlert$.next(this.translateService.instant('没有库存了'));
        return 0;
      }
      else {
        newTotQt = res;
        qt = Math.max(Math.min(newTotQt - totQt, qt), 0);
      }

      const found: ICart = Utility.clone(product);
      found.uniqueKey = key;
      found.PropIdno = found.PropIdno ?? "";
      found.Quantity = qt;
      found.Timestamp = timestamp;
      if (imgPath)
        found.ImgPath = imgPath;

      this.data.push(found);
      this.carts[key] = {
        idno: idno,
        PropIdno: found.PropIdno,
        Quantity: qt,
        Timestamp: timestamp
      };

      product.Quantity = qt;
      this.proNumRef[idno] = (this.proNumRef[idno] ?? 0) + qt;
      Product.generateTotal(found);
    } else {
      const found = this.data[foundIndex];
      const actQt = qt + found.Quantity!;

      if (actQt <= 0) {
        if (actQt < 0)
          qt = 0;

        found.Quantity = 0;
        product.Quantity = 0;
        this.data.splice(foundIndex, 1);
        delete this.carts[key];
      } else {
        if (qt > 0) {
          const maxNumPerOrder = product.MaxNumPerOrder!;
          res = Product.reachMaxNumPerOrder(product, totQt + qt, maxNumPerOrder);
          if (res === true) {
            this.eventsService.showAlert$.next(this.translateService.instant('此产品每单限订N件, 您已到达上限', { n: maxNumPerOrder }));
            return 0;
          }
          else {
            qt = Math.min(res - totQt, qt);
          }

          res = Product.reachStock(product, totQt + qt, propStock != undefined ? totQt + propStock : undefined, totalStock);
          if (res === true) {
            this.eventsService.showAlert$.next(this.translateService.instant('没有库存了'));
            return 0;
          }
          else {
            qt = Math.min(res - totQt, qt);
          }
        }

        const nowHave = qt + found.Quantity!;
        found.Quantity = nowHave;
        found.Timestamp = timestamp;
        this.carts[key].Quantity = nowHave;
        this.carts[key].Timestamp = timestamp;
        product.Quantity = nowHave;

        Product.generateTotal(found);
      }

      this.proNumRef[idno] += qt;
    }

    this.generateSum();
    WzzStorage.set(STORAGE_KEY, this.carts);

    if (emitEvent) {
      this.update$.next({ product, qt });
    }

    return qt;
  }

  private generateSum() {
    let totalQuantity: number = 0;
    let amount: number = 0;
    let vAmount = 0;
    let oAmount = 0;
    let totalWeight: number = 0;
    let total: number, oTotal: number;

    this.data.forEach((item: ICart) => {
      oTotal = item.Price! * item.Quantity!;
      total = item.Total!;
      const quantity = item.Quantity!;

      if (quantity > 0) {
        totalQuantity += quantity;
        totalWeight += quantity * (item.Weight || 0);
      }

      oAmount += oTotal;
      amount += total;
      if (item.ValuableMoaFinal) {
        vAmount += total;
      }
    });

    this.totalQuantity = totalQuantity;
    this.amount = Math.round(amount * 100) / 100;
    this.oAmount = Math.round(oAmount * 100) / 100;
    this.vAmount = Math.round(vAmount * 100) / 100;
    this.totalWeight = totalWeight;
  }

  clear(emitEvent = true) {
    this.data = [];
    this.carts = {};
    this.proNumRef = {};
    WzzStorage.set(STORAGE_KEY, {});
    this.totalQuantity = 0;
    this.amount = 0;
    this.oAmount = 0;
    this.vAmount = 0;
    this.totalWeight = 0;

    if (emitEvent)
      this.clear$.next();
  }

  getSum() {
    return [this.totalQuantity, this.oAmount, this.amount, this.vAmount, this.totalWeight];
  };

}