import { Inject, Injectable, Injector } from '@angular/core';
import { AjaxService } from '../fw/services/ajax.service';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from './cart.service';
import { ICart, IProduct } from '../interfaces/i-data';
import { Product } from '../utils/product';
import { Utility } from '../fw/utils/utility';

@Injectable({
  providedIn: 'root'
})
export class GiftService extends CartService {

  maxNum: number = 0;
  actNum: number = 0;

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected cartService: CartService,
    protected override translateService: TranslateService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, translateService, injector);
  }

  init(maxNum: number) {
    this.maxNum = maxNum;
    this.actNum = 0;
    this.proNumRef = {};
    super.setData([]);
  }

  override toCart(product: IProduct, qt: number, totalStock?: number, emitEvent: boolean = true, imgPath?: string, propStock?: number) {
    const idno = product.idno!;
    const key = Product.getKey(product);

    const foundIndex: number = this.data.findIndex(item => item.uniqueKey == key);
    const totQt: number = this.proNumRef[idno] ?? 0;
    const proTotQt = this.cartService.getProNumRef()[idno] ?? 0;

    const timestamp: number = Date.now();

    if (this.actNum + qt > this.maxNum) {
      this.eventsService.showAlert$.next(this.translateService.instant(
        "Ci sono un totale di N1 omaggi tra cui scegliere, e tu hai già scelto N2 omaggi", {
        n1: this.maxNum,
        n2: this.actNum
      }));
      return 0;
    }

    if (foundIndex == -1) {
      const [reachedStock, stock, diffStock] = Product.reachStock(product, totQt + qt, qt, totalStock, propStock);
      if (reachedStock === true) {
        this.eventsService.showAlert$.next(this.translateService.instant('没有库存了'));
        return 0;
      }
      else {
        qt = Math.max(qt, 0);
      }

      const found: ICart = Utility.clone(product);
      found.uniqueKey = key;
      found.PropIdno = found.PropIdno ?? "";
      found.Quantity = qt;
      found.Timestamp = timestamp;
      if (imgPath)
        found.ImgPath = imgPath;

      this.data.push(found);
      this.proNumRef[idno] = (this.proNumRef[idno] ?? 0) + qt;
      product.Quantity = qt;
    }
    else {
      const found = this.data[foundIndex];
      const actQt = qt + found.Quantity!;

      if (actQt <= 0) {
        if (actQt < 0)
          qt = 0;

        found.Quantity = 0;
        product.Quantity = 0;
        this.data.splice(foundIndex, 1);
      } else {
        if (qt > 0) {
          const [reachedStock, stock, diffStock] = Product.reachStock(product, totQt + qt, actQt, totalStock, propStock);
          if (reachedStock === true) {
            this.eventsService.showAlert$.next(this.translateService.instant('没有库存了'));
            return 0;
          }
        }

        const nowHave = qt + found.Quantity!;
        found.Quantity = nowHave;
        found.Timestamp = timestamp;
        product.Quantity = nowHave;
      }

      this.proNumRef[idno] += qt;
    }

    this.actNum += qt;

    return qt;
  }
}