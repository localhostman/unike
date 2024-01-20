import { Directive, ChangeDetectorRef, AfterViewInit, Inject, Injector, OnDestroy } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
    GoogleLoginProvider,
    FacebookLoginProvider
} from '@abacritt/angularx-social-login';

import { MeService } from 'src/app/services/me.service';
import { IPromo, IShop } from 'src/app/interfaces/i-data';
import { ShopService } from 'src/app/services/shop.service';
import { Platform } from '@ionic/angular';
import { ModalPage } from 'src/app/fw/bases/modal/modal.page';
import { FormBuilder, Validators } from '@angular/forms';

const WX_WEB_APPID: string = "wxd8613085d7e95081";
const WX_WEB_CALLBACK_URL: string = "callback/wx_web_login.php";
const WX_INNER_CALLBACK_URL: string = "callback/wx_inner_login.php";

const LOGIN_TYPE = "email";

@Directive()
export class LoginBase extends ModalPage implements AfterViewInit, OnDestroy {

    private _tid: any;
    private _vcMaxInterval = 60;
    vcInterval = 0;

    shop!: IShop;

    loginMethods: any;
    wxWin!: Window;
    wechat!: boolean;
    event!: IPromo;

    constructor(
        @Inject("baseUrl") protected baseUrl: string,
        protected platform: Platform,
        protected shopService: ShopService,
        protected authService: SocialAuthService,
        protected override service: MeService,
        protected fb: FormBuilder,
        protected override injector: Injector,
        public override cdRef: ChangeDetectorRef
    ) {
        super(service, injector, cdRef);

        this.form = this.fb.group({
            "Type": [LOGIN_TYPE],
            "Email": ["", [Validators.required]],
            "VerifyCode": ["", [Validators.required]]
        });
    }

    override async ngAfterViewInit() {
        this.loginMethods = this.envExt.loginMethods;
        this.wechat = this.envExt.wechat;
        this.shop = this.envExt.shop;
        this.event = this.envExt?.eventsShoudan[0];

        try {
            await this.authService.signOut(true);
        } catch (e) { }

        this.visible = true;
        this.cdRef.detectChanges();

        this.subscription.add(this.authService.authState.subscribe((user: SocialUser) => {
            if (!!user) {
                this.loadingService.run(async () => {
                    const res = await this.service.unifiedLogin({ id: user.id, Email: user.email, Logo: user.photoUrl, NickName: user.name });
                    const me = res?.topics;
                    this.envExt.me = me;

                    this.eventsService.loginStateChange$.next(true);

                    this.getMessageExt().toast(this.lang(`您好: N, 欢迎使用S!`, { n: me.NickName, s: this.shop.Name }));

                    this.close(true);
                });

            }
        }));
    }

    override async close(data?: any, role?: string) {
        await super.close(data, role);
        clearInterval(this._tid);
    }

    async onSendVerifyCode() {
        const to = this.form.get("Email")!.value.toString();
        if (!to) {
            this.getMessageExt().alert(this.lang("Inserisci l'email da inviare codice"));
            return;
        }

        await this.loadingService.run(async () => {
            const res = await this.service.sendVerifyCode({ Type: LOGIN_TYPE, To: to });
            if (res) {
                this._startVcCountdown();
                this.getMessageExt().toast(this.lang("Il codice di verifica è stato inviato, si prega di aprire l'e-mail per visualizzare"));
            }
        });
    }

    async onLogin() {
        if (this.form.invalid) {
            this.getMessageExt().alert(this.lang("Inserisci email e codice di verifica"));
            return;
        }

        const value = this.form.getRawValue();
        value.id = value.Email;

        this.loadingService.run(async () => {
            const res = await this.service.unifiedLogin(value);
            const me = res?.topics;
            this.envExt.me = me;

            this.eventsService.loginStateChange$.next(true);

            this.getMessageExt().toast(this.lang(`您好: N, 欢迎使用S!`, { n: me.NickName, s: this.shop.Name }));

            this.close(true);
        });
    }


    async onGGLogin() {
        const authToken = await this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID);
        this.loadingService.run(async () => {
            const res = await this.service.ggLogin("", authToken);
            const me = res?.topics;
            this.envExt.me = me;

            this.eventsService.loginStateChange$.next(true);

            this.getMessageExt().toast(this.lang(`您好: N, 欢迎使用S!`, { n: me.NickName, s: this.shop.Name }));

            this.close(true);
        });
    }


    onFBLogin() {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    async onWXLogin() {
        if (this.wechat) {
            this.wxLoginViaJSAPI();
        }
        else {
            this.wxLoginViaWindow();
        }
    }

    async wxLoginViaWindow() {
        let winWidth: number = 600;
        let winHeight: number = 600;

        let screenWidth = this.platform.width();
        let screenHeight = this.platform.height();
        let left = (screenWidth - winWidth) / 2;
        let top = (screenHeight - winHeight) / 2;

        let url = `https://open.weixin.qq.com/connect/qrconnect?appid=${WX_WEB_APPID}&redirect_uri=${encodeURI(this.baseUrl + WX_WEB_CALLBACK_URL)}&response_type=code&scope=snsapi_login&state=${this.envExt.token}#wechat_redirect`;
        this.wxWin = window.open(url, "登录-微信授权", `width=${winWidth},height=${winHeight},left=${left},top=${top},status=no`)!;
    }

    async wxLoginViaJSAPI() {
        let state: string = this.envExt.token + '_' + encodeURIComponent(this.getDocument().location.href);
        this.envExt.exitAlertDelay = 999999;
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.shop.ServiceAppId}&redirect_uri=${encodeURI(this.baseUrl + WX_INNER_CALLBACK_URL)}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    }

    private _startVcCountdown() {
        this.vcInterval = this._vcMaxInterval;
        clearInterval(this._tid);

        this._tid = setInterval(() => {
            this.vcInterval--;
            console.log(this.vcInterval);
            if (this.vcInterval <= 0) {
                clearInterval(this._tid);
            }

            this.cdRef.detectChanges();
        }, 1000);
    }
}
