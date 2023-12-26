import { EnvExtension } from './env';
import { Injectable, Injector } from '@angular/core';
import { DeliveryMethodService } from '../services/delivery-method.service';
import { PaymentMethodService } from '../services/payment-method.service';
import { IDeliveryMethod, IPaymentMethod, IOrder } from '../interfaces/i-data';
import { ActionSheetController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { LangBase } from '../fw/bases/lang/lang.base';
import { PaymentModalPage } from '../modals/payment-modal/payment-modal.page';
import { PAYMENT_METHOD } from 'src/app/const/const';
import { MessageExtension } from './message';

// declare var WeixinJSBridge: any;

@Injectable({
    providedIn: 'root'
})
export class PaymentExtension extends LangBase {

    paymentMethod!: IPaymentMethod;
    hasDetail: boolean = false;

    update$ = new Subject<void>();

    constructor(
        public messageExt: MessageExtension,
        public envExt: EnvExtension,
        private deiveryMethodService: DeliveryMethodService,
        private service: PaymentMethodService,
        private asCtrl: ActionSheetController,
        protected override injector: Injector
    ) {
        super(injector);
    }

    async initialize() {
        let d: IDeliveryMethod = await this.deiveryMethodService.getSelectedItem();
        this.service.setStrict(d.SupportedPayments);
        await this.update();
    }

    async select() {
        let data: IPaymentMethod[] = (await this.service.getData())!;

        if (data.length <= 1)
            return;

        const buttons: any[] = data
            .filter((item: IPaymentMethod) => item.id != this.paymentMethod.id)
            .map((item: IPaymentMethod) => {
                return {
                    text: item.Name, handler: async () => {
                        this.paymentMethod = await this.service.setSelectedItem(item);
                        await this.update(this.paymentMethod);
                        this.update$.next();
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
            header: this.lang('请选择您的支付方式'),
            buttons: buttons
        });

        await as.present();
    }

    async update(p0?: IPaymentMethod) {
        const p = p0 || (await this.service.getSelectedItem())!;
        this.paymentMethod = p;
        this.hasDetail = !!p.Detail;
    }

    pay(order: IOrder, payInfo: any) {
        return new Promise(async (resolve, reject) => {
            let modal: HTMLIonModalElement;
            switch (this.paymentMethod.TypeId) {
                case PAYMENT_METHOD.CASH_ON_DELIVERY:
                case PAYMENT_METHOD.MONEY_TRANSFER:
                    resolve(true);
                    break;
                case PAYMENT_METHOD.WX_PAY:
                    if (this.envExt.wechat) {
                        this.wxInnerPay(payInfo, resolve, reject);
                    }
                    else {
                        modal = await this.messageExt.createModal({
                            component: PaymentModalPage,
                            cssClass: 'modal-t1',
                            backdropDismiss: false,
                            componentProps: {
                                order: order,
                                paymentMethod: this.paymentMethod,
                                payInfo: payInfo
                            }
                        });
                        await modal.present();
                        modal.onDidDismiss().then((data) => {
                            if (data.data)
                                resolve(true);
                            else
                                reject();
                        });
                    }
                    break;
                case PAYMENT_METHOD.PAYPAL:
                    modal = await this.messageExt.createModal({
                        component: PaymentModalPage,
                        cssClass: 'modal-t1',
                        backdropDismiss: false,
                        componentProps: {
                            order: order,
                            paymentMethod: this.paymentMethod,
                            payInfo: payInfo
                        }
                    });
                    await modal.present();
                    modal.onDidDismiss().then((data) => {
                        if (data.data)
                            resolve(true);
                        else
                            reject();
                    });
                    break;
            }
        });
    }

    wxInnerPay(payInfo: any, resolve: Function, reject: Function) {
        // const shop: IShop = this.envExt.shop;

        // WeixinJSBridge.invoke(
        //     'getBrandWCPayRequest', {
        //     "appId": shop.ServiceAppId,     //公众号名称，由商户传入     
        //     "timeStamp": payInfo.timeStamp,         //时间戳，自1970年以来的秒数     
        //     "nonceStr": payInfo.nonceStr, //随机串     
        //     "package": payInfo.package,
        //     "signType": payInfo.signType,         //微信签名方式：     
        //     "paySign": payInfo.paySign //微信签名 
        // },
        //     async (res: any) => {
        //         if (res.err_msg == "get_brand_wcpay_request:ok") {
        //             // 使用以上方式判断前端返回,微信团队郑重提示：
        //             //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        //             resolve();
        //         }
        //         else {
        //             const confirm = await this.confirmCtrl.create({
        //                 header: this.lang("支付被取消"),
        //                 message: this.lang("订单支付被用户取消, 需要再次调起支付吗"),
        //                 cssClass: 'wzz-alert',
        //                 buttons: [
        //                     {
        //                         text: this.lang("下次再说"),
        //                         role: 'cancel',
        //                         handler: () => {
        //                             reject();
        //                         }
        //                     },
        //                     {
        //                         text: this.lang("立即支付"),
        //                         handler: () => {
        //                             this.wxInnerPay(payInfo, resolve, reject);
        //                         }
        //                     },
        //                 ]
        //             });

        //             confirm.present();
        //         }
        //     });
    }
}