import { MessageExtension } from '../fw/extensions/message';
import { Injectable, Injector, ChangeDetectorRef } from '@angular/core';
import { DeliveryMethodService } from '../services/delivery-method.service';
import { CartService } from '../services/cart.service';
import { IDeliveryMethod, IWeightFare, IProduct, ICart } from 'src/app/interfaces/i-data';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { LangBase } from '../fw/bases/lang/lang.base';
import { DELIVERY_METHOD } from '../const/const';
import { SUCCESS_MESSAGE } from '../fw/const/const';

const productSupportDelivery = function (d: IDeliveryMethod, p: IProduct) {
    return (d.TypeId != DELIVERY_METHOD.POST || p.Mailable) &&
        (!d.SupportedCategories || d.SupportedCategories.some(function (item) {
            return p.CategoryId!.indexOf(item) == 0 || p.CategoryId2!.indexOf(item) == 0
        }));
}

@Injectable({
    providedIn: 'root'
})
export class DeliveryExtension extends LangBase {
    selectedDeliveryMethodId!: number;
    enableSendOrder: boolean = false;
    totalQuantity: number = 0;
    oAmount: number = 0;
    amount: number = 0;
    diffAmount: number = 0;
    transportFare: number = 0;
    deliveryMethod!: IDeliveryMethod;
    hasDetail: boolean = false;
    needAddress: boolean = true;
    isPost: boolean = false;

    change$ = new Subject<any>();

    constructor(
        public messageExt: MessageExtension,
        private service: DeliveryMethodService,
        private cartService: CartService,
        private asCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        protected override injector: Injector
    ) {
        super(injector);
    }

    initialize() {
        this.update();
    }

    addChangeSubscription(cdRef: ChangeDetectorRef, dataFn: Function, callback?: Function) {
        return this.change$.subscribe((dProNumRef: { [key: string]: number }) => {
            const data: IProduct[] = dataFn();
            const ltime = Date.now();
            data.forEach(item => {
                const num = dProNumRef[item.idno!];
                if (!!num) {
                    item.Quantity = (item.Quantity ?? 0) - num;
                }
                item.LTime = ltime;
            });

            if (callback)
                callback();

            cdRef.detectChanges();
        })
    }

    get discount() {
        return this.deliveryMethod.Discount;
    }

    async select() {
        let data: IDeliveryMethod[] = await this.service.getData();

        if (data.length <= 1)
            return;

        let buttons: any[] = data
            .filter((item: IDeliveryMethod) => item.id != this.selectedDeliveryMethodId)
            .map((item: IDeliveryMethod) => {
                return {
                    text: item.Name, handler: async () => {
                        await this.change(item.id!);
                    }
                };
            });

        buttons.push({
            text: this.lang('取消'),
            role: 'cancel',
            handler: () => {

            }
        });

        let as = await this.asCtrl.create({
            header: this.lang('请选择需要切换的配送方式'),
            buttons: buttons
        });

        await as.present();
    }

    async change(id: number) {
        let d: IDeliveryMethod = await this.service.getSelectedItem(id);
        let title: string = this.lang("D规则", { d: d.Name });
        let text: string = d.Detail!;

        let carts: ICart[] = await this.cartService.getData();
        let dCarts: ICart[], vCarts: ICart[], dProNumRef: { [key: string]: number } = {};

        if (d.TypeId == DELIVERY_METHOD.POST) {
            vCarts = [];
            dCarts = [];
            carts.forEach(cart => {
                const idno = cart.idno ?? "";
                if (productSupportDelivery(d, cart)) {
                    vCarts.push(cart);
                }
                else {
                    dProNumRef[idno] = (dProNumRef[idno] ?? 0) + (cart.Quantity ?? 0);
                    dCarts.push(cart);
                }
            });

            if (dCarts.length > 0) {
                text += "<div class='delivery-alert-warning'>*" + this.lang("下列商品不支持N, 将在切换配送方式后从购物车中删除", { n: d.Name }) + ":</div>" +
                    dCarts.map(item => "<div class='delivery-alert-product'><div class='delivery-alert-product-name'>" + item.Name + "</div><div class='delivery-alert-product-qt'>x" + item.Quantity + '</div></div>').join("");
            }
        }
        else {
            dCarts = [];
            vCarts = carts;
        }

        if (!text) {
            d = await this.service.setSelectedId(d.id);
            await this.update(d);
            this.change$.next(dProNumRef);
            this.messageExt.toast(this.lang(SUCCESS_MESSAGE));
            return;
        }

        const confirm = await this.alertCtrl.create({
            header: title,
            message: text,
            cssClass: 'delivery-alert',
            buttons: [{
                text: this.lang('暂不切换'),
                role: 'cancel',
                handler: () => {

                }
            },
            {
                text: this.lang('确认切换'),
                handler: async () => {
                    this.cartService.setCarts(vCarts, d);
                    d = await this.service.setSelectedId(d.id);
                    await this.update(d);
                    this.change$.next(dProNumRef);
                }
            }]
        });

        await confirm.present();
    };

    async update(d1?: IDeliveryMethod) { //[是否可发单, 运费]
        let [totalQuantity, oAmount, amount, vAmount, totalWeight] = this.cartService.getSum();

        const [enableSendOrder, transportFare, diffAmount, d] = await this.getSum(vAmount, totalWeight, d1);

        this.enableSendOrder = enableSendOrder;
        this.totalQuantity = totalQuantity;
        this.oAmount = oAmount;
        this.amount = amount;
        this.diffAmount = diffAmount;
        this.transportFare = transportFare;
        this.deliveryMethod = d;
        this.selectedDeliveryMethodId = d.id;
        this.hasDetail = !!d.Detail;
        this.needAddress = d.TypeId != DELIVERY_METHOD.SELF_DELIVERY;
        this.isPost = this.deliveryMethod.TypeId == DELIVERY_METHOD.POST;
    }

    async showDetail() {
        const alert = await this.alertCtrl.create({
            header: this.lang("D规则", { d: this.deliveryMethod.Name }),
            message: this.deliveryMethod.Detail,
            cssClass: 'wzz-alert',
            buttons: [this.lang('好的')]
        });

        alert.present();
    }

    async getSum(vAmount: number, totalWeight: number, d0?: IDeliveryMethod): Promise<[boolean, number, number, IDeliveryMethod]> {
        let enableSendOrder: boolean, transportFare: number;
        let moa: number = 0;

        const d = d0 ?? await this.service.getSelectedItem();
        let weightFare = d.WeightFare;

        if (!!weightFare && weightFare != "[]") {
            if (typeof weightFare == "string") {
                weightFare = JSON.parse(weightFare);
                d.WeightFare = weightFare;
            }

            let ct: number = 0;
            let cwf: IWeightFare;
            let len: number = weightFare.length;

            do {
                cwf = weightFare[ct]!;
                if (cwf.From! <= totalWeight && (!cwf.To || cwf.To >= totalWeight))
                    break;
                ct++;
            } while (ct < len);

            enableSendOrder = true;
            transportFare = Math.ceil(totalWeight / cwf.Rate!) * cwf.Fare!;
        } else {
            moa = d.MinimumOrderAmount!;
            let tf: number = d.TransportFare!;

            if (!!moa) {
                if (vAmount < moa) {
                    if (!!tf) {
                        enableSendOrder = true;
                        transportFare = tf;
                    } else {
                        enableSendOrder = false;
                        transportFare = 0;
                    }
                } else {
                    enableSendOrder = true;
                    transportFare = 0;
                }
            } else {
                enableSendOrder = true;
                transportFare = tf || 0;
            }
        }

        return [enableSendOrder, transportFare, moa - vAmount, d];
    }

}