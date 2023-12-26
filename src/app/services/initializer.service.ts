import { PLATFORM_DOMAIN, PROMO_TYPE } from './../const/const';
import { RouterLinkExtension } from './../extensions/router-link';
import { LangExtension } from './../extensions/lang';
import { Platform } from '@ionic/angular';
import { CookieService } from './../fw/services/cookie.service';
import { EnvExtension } from './../extensions/env';
import { PLATFORM_ID } from '@angular/core';
import { Injectable, Injector, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AjaxService } from '../fw/services/ajax.service';
import { Env } from '../fw/dynamics/env';
import { WzzStorage } from '../fw/utils/wzz-storage';
import { Utility } from '../fw/utils/utility';
import { RES_TYPE, CF_MSG } from '../fw/const/const';
import { IRes } from '../fw/interfaces/i-res';
import { EventsService } from '../fw/dynamics/events.service';
import { Router } from '@angular/router';
import { DeliveryMethodService } from './delivery-method.service';
import { PaymentMethodService } from './payment-method.service';
import { ProductPropService } from './product-prop.service';
import { CartService } from './cart.service';
import { DeliveryExtension } from '../extensions/delivery';
import { Title } from '@angular/platform-browser';
import { SHOP_SETTING } from '../const/const';
import { CategoryService } from './category.service';
import { SearchExtension } from '../extensions/search';

const themeToString = function (theme: { [key: string]: string }) {
  let o: string = "";
  for (let key in theme) {
    o += `--ion-${key}: ${theme[key]};`;
  }
  return o;
}

@Injectable({
  providedIn: 'root'
})

export class InitializerService {

  constructor(
    @Inject("apiUrl") private apiUrl: string,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) protected platformId: any,
    protected routerLinkExt: RouterLinkExtension,
    private deliveryExt: DeliveryExtension,
    protected langExt: LangExtension,
    private searchExt: SearchExtension,
    public envExt: EnvExtension,
    private titleService: Title,
    protected events: EventsService,
    private ajaxService: AjaxService,
    private deliveryMethodService: DeliveryMethodService,
    private paymentMethodService: PaymentMethodService,
    private productPropService: ProductPropService,
    private cartService: CartService,
    private categoryService: CategoryService,
    protected cookieService: CookieService,
    protected translateService: TranslateService,
    protected platform: Platform,
    protected router: Router,
    protected injector: Injector
  ) {
  }
  async init() {
    let versions = Utility.getBrowser().versions;
    let { origin, protocol, href, hash } = this.document.location;
    let token: string = "";
    let language: string = "";
    const mobile = this.platform.is("mobile") || this.platform.is("android") || this.platform.is("ios");

    this.envExt.protocol = protocol;
    this.envExt.wechat = versions.wechat;
    this.envExt.mobile = mobile;
    this.envExt.native = this.platform.is("capacitor");
    WzzStorage.init(this.platformId, this.envExt, this.cookieService, this.translateService);

    let [path] = href.split("?");
    if (hash)
      path = path.split("#").pop()!;

    let [, firstPart] = path.split("/");
    firstPart = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    if (Env.POSSIBLE_LANG_NAMES[firstPart])
      language = firstPart;

    if (!language) {
      const tmp = await this.langExt.read();
      if (tmp)
        language = tmp;
      else {
        language = this.translateService.getBrowserLang()!;
        if (["zh", "zh-hans"].indexOf(language) != -1)
          language = Env.CN;
        else
          language = language.charAt(0).toUpperCase() + language.slice(1);
      }
    }

    if (Env.POSSIBLE_LANGS.indexOf(language) != -1) {
    }
    else
      language = Env.IT;

    this.routerLinkExt.init(language, mobile);
    this.translateService.addLangs(Env.POSSIBLE_LANGS);

    this.langExt.updateViewlang(language);
    this.translateService.use(language);

    await this.initEnv(token, language);
    await this.initSome();

    this.categoryService.init();
  }

  async reinit() {
    await this.initSome();
  }

  private async initEnv(token: string, language: string) {
    const env = await WzzStorage.getEnv();
    this.envExt.token = !!token ? token : env.token!;
    this.envExt.language = language;
    this.translateService.addLangs(Env.POSSIBLE_LANGS);
    this.translateService.use(language);
    this.document.documentElement.lang = Utility.getLangForHtmlAttribute(language);
  }
  private async initSome() {
    return new Promise<boolean>(async (resolve) => {
      let carts = await this.cartService.getDataFromStorage();

      let res: IRes = await this.ajaxService.post(Utility.generateQueryString(this.apiUrl + "&init&opr=web&code=ujson&debug=1"), carts);
      const token = res.token!;

      if (this.envExt.token == "" || this.envExt.token != token) {
        this.envExt.token = token;
        this.ajaxService.updateHeaderAutorization(token);
      }

      switch (res.type) {
        case RES_TYPE.SUCCESS:
          const {
            App,
            IsLogin,
            SupportWxPay,
            Me,
            ShopInfo,
            HotSearches,
            Carts,
            Setting,
            ProductProps,
            DeliveryMethods,
            PaymentMethods,
            WeightUM,
            GiftThreshold,
            ShowProOrderedStartAt,
            ShowProValutateStartAt,
            ProductImageRatio,
            ShowStock,
            ShowZip,
            ShowShopAddress,
            ShowPropPrice,
            LoginMethods,
            HasApp,
            Events,
          } = res.topics;

          if (IsLogin)
            this.envExt.me = Me;

          this.searchExt.init(HotSearches);
          this.productPropService.setData(ProductProps);
          this.deliveryMethodService.setData(DeliveryMethods);
          this.paymentMethodService.setData(PaymentMethods);

          const d = await this.deliveryMethodService.getSelectedItem();

          this.cartService.setCarts(Carts, d);
          this.deliveryExt.initialize();

          this.envExt.shop = ShopInfo;
          this.envExt.app = App;
          this.envExt.exchangeRate = Setting[SHOP_SETTING.EXCHANGE_RATE];
          this.envExt.supportWxPay = SupportWxPay;
          this.envExt.maxOrderProductCount = ShopInfo.MaxOrderProductCount;

          this.envExt.loginMethods = LoginMethods;
          this.envExt.weightUM = WeightUM;
          this.envExt.giftThreshold = GiftThreshold;
          this.envExt.showProOrderedStartAt = ShowProOrderedStartAt;
          this.envExt.showProValutateStartAt = ShowProValutateStartAt;
          this.envExt.productImageRatio = ProductImageRatio;
          this.envExt.showStock = ShowStock;
          this.envExt.showZip = ShowZip;
          this.envExt.showShopAddress = ShowShopAddress;
          this.envExt.showPropPrice = ShowPropPrice;
          this.envExt.hasApp = HasApp;
          this.envExt.eventsHuodong = Events[PROMO_TYPE.HUO_DONG] ?? [];
          this.envExt.eventsShoudan = Events[PROMO_TYPE.SHOU_DAN] ?? [];

          this.titleService.setTitle(ShopInfo.Name);
          this.document.getElementById("favicon")!.setAttribute("href", ShopInfo.LogoUrl);
          this.document.documentElement.style.cssText = themeToString(JSON.parse(ShopInfo.Theme)) + "--pro-height: " + ProductImageRatio * 100 + "%;";

          // if (PrivateHomePage && this.path == "/tabs/home") {
          //   this.router.navigateByUrl("/" + App);
          // }

          await WzzStorage.setToken(res.token!);
          resolve(true);
          break;
        case RES_TYPE.NEED_LOGIN:
          this.envExt.me = undefined;
          await WzzStorage.setToken(res.token!);
          resolve(true);
          break;
        case RES_TYPE.FAIL:
          alert(CF_MSG);
          break;
      }
    });
  }

}

