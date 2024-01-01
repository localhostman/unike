import { Product } from './../utils/product';
import { ProductPropPage } from '../modals/product-prop/product-prop.page';
import { CartService } from './../services/cart.service';
import { IProduct, IDeliveryMethod } from './../interfaces/i-data';
import { IOrderProductRef, OrderService } from './../services/order.service';
import { ChangeDetectorRef, Injectable } from "@angular/core";
import { MessageExtension } from '../fw/extensions/message';

const normalize = function (item: any, ref: any, proNumRef: any, d: IDeliveryMethod, callback?: Function) {
    if (!item)
        return;
    const idno = item.idno;

    item.Quantity = proNumRef[idno] ?? 0;
    item.ValuableMoaFinal = Product.isValuableMoa(item, d);

    if (ref) {
        if (ref[idno]) {
            ref[idno].push(item);
        }
        else
            ref[idno] = [item];
    }

    if (callback)
        callback(item);
}

@Injectable({
    providedIn: 'root'
})
export class ProductExtension {
    constructor(
        private _messageExt: MessageExtension,
        private _cartService: CartService,
        private _orderService: OrderService
    ) {
    }

    normalize(pros: any, d: IDeliveryMethod, ref?: any, callback?: Function) {
        const proNumRef = this._cartService.getProNumRef();
        if (Array.isArray(pros)) {
            pros.forEach(item => {
                normalize(item, ref, proNumRef, d, callback);
            });
        }
        else {
            if (pros)
                normalize(pros, ref, proNumRef, d, callback);
        }
    }

    addCartSubscription(cdRef: ChangeDetectorRef, refFn: Function, callback?: Function) {
        return this._cartService.update$.subscribe(({ product, qt }) => {
            const ref = refFn();
            if (product) {
                const founds: any[] = ref[product.idno!];
                if (founds) {
                    founds.forEach((item) => {
                        if (qt == undefined)
                            item.Quantity = 0;
                        else
                            item.Quantity += qt;

                        item.LTime = Date.now();
                    });

                    if (callback)
                        callback();

                    cdRef.detectChanges();
                }
            }
        })
    }

    addClearAllSubscription(cdRef: ChangeDetectorRef, dataFn: Function, callback?: Function) {
        return this._cartService.clear$.subscribe(() => {
            const data: IProduct[] = dataFn();
            const ltime = Date.now();

            data.forEach((item) => {
                item.Quantity = 0;
                item.LTime = ltime;
            });

            if (callback)
                callback();

            cdRef.detectChanges();
        })
    }

    addOrderSaveSubscription(cdRef: ChangeDetectorRef, dataFn: Function, callback?: Function) {
        return this._orderService.save$.subscribe(async (opRef: IOrderProductRef) => {
            const data = dataFn();
            const ltime = Date.now();

            data.forEach((item: IProduct) => {
                const idno = item.idno!;
                const found = opRef[idno];
                if (found) {
                    const qt = found.qt ?? 0;
                    item.LTime = ltime;
                    item.Quantity = 0;

                    if (qt) {
                        item.OrderedCount! += qt;
                        item.Stock! -= qt;
                        const propStocks = item.PropStocks;
                        if (propStocks)
                            found.propQt.forEach((subItem: any) => {
                                propStocks[subItem.propIdno] -= subItem.qt;
                            })
                    }

                    if (callback)
                        callback(item, found);
                }
            });

            cdRef.detectChanges();
        })
    }

    async toCart(product: IProduct, qt: number, totalStock: number) {
        let props = product.Props;

        if (typeof props == "string") {
            try {
                props = JSON.parse(props);
            } catch (e) {
                props = "";
            }
            product.Props = props;
        }

        if (!!props) {
            const modal = await this._messageExt.createModal({
                component: ProductPropPage,
                cssClass: "modal-t1",
                componentProps: {
                    data: product
                }
            });
            await modal.present();
        } else {
            qt = this._cartService.toCart(product, qt, totalStock);
        }
    };

}