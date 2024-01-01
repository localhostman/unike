import { MessageExtension } from '../fw/extensions/message';
import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Env } from '../fw/dynamics/env';
import { AjaxService } from '../fw/services/ajax.service';
import { Utility } from '../fw/utils/utility';
import { RouterLinkExtension } from '../fw/extensions/router-link';
import { LANG_COOKIE } from 'src/app/fw/services/cookie.service';
import { Router, Route } from '@angular/router';
import { WzzStorage } from '../fw/utils/wzz-storage';
import { LoadingService } from '../fw/services/loading.service';
import { EnvExtension } from './env';

@Injectable({
    providedIn: 'root'
})
export class LangExtension {

    constructor(
        @Inject(DOCUMENT) private document: Document,
        public rExt: RouterLinkExtension,
        public messageExt: MessageExtension,
        public envExt: EnvExtension,
        private loadingService: LoadingService,
        private ajaxService: AjaxService,
        private translateService: TranslateService,
        private asCtrl: ActionSheetController,
        private location: Location,
        private router: Router
    ) {
    }

    showLanguageAS() {
        return new Promise(async (resolve, reject) => {
            const langNames: { [key: string]: string } = Env.POSSIBLE_LANG_NAMES;
            const language = this.translateService.currentLang;
            const langASButtons: any[] = Env.POSSIBLE_LANGS.filter((lang: string) => lang != language).map((lang: string) => {
                return {
                    text: langNames[lang], cssClass: 'lang-as-btn ' + lang, handler: () => {
                        this.messageExt.confirm({
                            message: this.translateService.instant("切换语言后将会自动刷新页面, 请点击'确定'按钮继续"),
                            success: async () => {
                                await this._changeLang(lang);
                                resolve(true);
                            }
                        });

                    }
                };
            });

            langASButtons.push({
                text: this.translateService.instant('取消'),
                role: 'cancel',
                handler: () => {
                    resolve(false);
                }
            })

            const as = await this.asCtrl.create({
                cssClass: "lang-as",
                header: this.translateService.instant('请选择语言进行切换'),
                buttons: langASButtons
            });

            await as.present();
        });
    }

    changeLang(lang: string) {
        this.loadingService.run(async () => {
            await this._changeLang(lang);
        });
    }

    private async _changeLang(lang: string) {
        await this.save(lang);

        const location = this.document.location;
        const url = this.location.path(true);

        let [part1, part2] = url.split("?");
        if (part2)
            part2 = "?" + part2;
        else
            part2 = "";

        this.location.replaceState(this.rExt.invertRouterLink(part1.split("/"), lang) + part2);
        location.reload();

        // this.updateViewlang(lang);
        // await firstValueFrom(this.translateService.use(lang));
        // this.envExt.language = lang;

        // const url = this.location.path(true);
        // let [part1, part2] = url.split("?");
        // if (part2)
        //     part2 = "?" + part2;
        // else
        //     part2 = "";

        // await this.navCtrl.navigateRoot(this.rExt.invertRouterLink(part1.split("/")) + part2);
    }

    save(val: string) {
        return WzzStorage.set(LANG_COOKIE, val, "");
    }

    read() {
        return WzzStorage.get(LANG_COOKIE, "");
    }

    updateViewlang(lang: string) {
        this.save(lang);
        this.ajaxService.changeHeaderLang(lang);
        this.document.documentElement.lang = Utility.getLangForHtmlAttribute(lang);

        const lowerLang = lang.toLowerCase();
        const routes: Route[] = this.rExt.routes[lang].concat([
            {
                path: `${lowerLang}/not-found`,
                loadChildren: () => import('../pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
            },
            {
                path: '',
                redirectTo: `/${lowerLang}/home`,
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: `/${lowerLang}/not-found`
            },
            {
                path: 'paypal',
                loadChildren: () => import('../pages/paypal/paypal.module').then(m => m.PaypalPageModule)
            },
            {
                path: 'login-modal',
                loadChildren: () => import('../modals/login-modal/login-modal.module').then(m => m.LoginModalPageModule)
            },
            {
                path: 'product-prop-modal',
                loadChildren: () => import('../modals/product-prop/product-prop.module').then(m => m.ProductPropPageModule)
            },
            {
                path: 'gift-prop-modal',
                loadChildren: () => import('../modals/gift-prop/gift-prop.module').then(m => m.GiftPropPageModule)
            },
            {
                path: 'order-detail-modal',
                loadChildren: () => import('../modals/order-detail/order-detail.module').then(m => m.OrderDetailPageModule)
            },
            {
                path: 'create-return-modal',
                loadChildren: () => import('../modals/create-return/create-return.module').then(m => m.CreateReturnPageModule)
            },
            {
                path: 'return-detail-modal',
                loadChildren: () => import('../modals/return-detail/return-detail.module').then(m => m.ReturnDetailPageModule)
            },
            {
                path: 'address-detail-modal',
                loadChildren: () => import('../modals/address-detail/address-detail.module').then(m => m.AddressDetailPageModule)
            },
            {
                path: 'payment-modal',
                loadChildren: () => import('../modals/payment-modal/payment-modal.module').then(m => m.PaymentModalPageModule)
            },
            {
                path: 'select-gift',
                loadChildren: () => import('../modals/select-gift/select-gift.module').then(m => m.SelectGiftPageModule)
            },
            {
                path: 'send-order',
                loadChildren: () => import('../modals/send-order/send-order.module').then(m => m.SendOrderPageModule)
            }
        ])

        this.router.resetConfig(routes);
    }

}