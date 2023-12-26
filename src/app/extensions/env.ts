import { IUser, IShop } from 'src/app/interfaces/i-data';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EnvExtension {

    private _me?: IUser;

    miniprogram: boolean = false;
    mobile: boolean = false;
    wechat: boolean = false;
    native: boolean = false;
    protocol!: string;

    //<!--
    platformId: any;
    historyPopTime: number = 0;

    shop!: IShop;
    userIdno?: string;
    app!: string;
    votes: { [key: string]: number } = {};
    maxOrderProductCount!: number;
    exitAlertDelay: number = 1000;
    exchangeRate!: number;

    loginMethods: any;
    showStock!: boolean;
    showZip!: boolean;
    showShopAddress!: boolean;
    showPropPrice!: boolean;
    weightUM!: string;
    giftThreshold!: number;
    showProOrderedStartAt!: number;
    showProValutateStartAt!: number;
    productImageRatio!: number;
    eventsHuodong!: any[];
    eventsShoudan!: any[];
    //-->
    language!: string;
    token!: string;
    hasApp: boolean = false;

    constructor(
    ) {
    }

    set me(data: IUser | undefined) {
        this._me = data;
        this.userIdno = data?.idno;
    }

    get me() {
        return this._me;
    }

    isLogin() {
        return !!this.userIdno;
    }

    logout() {
        this.me = undefined;
    }

}