import { Preferences } from '@capacitor/preferences';
import { IEnv } from '../interfaces/i-env';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { EnvExtension } from 'src/app/extensions/env';
import { CookieService } from 'ngx-cookie-service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export const APP: string = "_istar_";
export const ENV: string = APP + "env";
export const SHOP_ID: string = "shop_id";

const _getKey = function (globalPrefix: string, localPrefix: string, key: string) {
  return (localPrefix ?? globalPrefix) + key;
}

export class WzzStorage {

  private static _prefix: string = APP;
  private static _instance: WzzStorage;

  private _platformId: any;
  private _envExt: EnvExtension;
  private _cookieService: CookieService;
  private _ssrCookieService: SsrCookieService;
  private _translateService: TranslateService;

  constructor(
    platformId: any,
    envExt: EnvExtension,
    cookieService: CookieService,
    ssrCookieService: SsrCookieService,
    translateService: TranslateService
  ) {
    this._platformId = platformId;
    this._envExt = envExt;
    this._cookieService = cookieService;
    this._ssrCookieService = ssrCookieService;
    this._translateService = translateService;
  }

  private async _set(key: string, value: any, prefix?: string): Promise<boolean> {
    key = _getKey(WzzStorage._prefix, prefix!, key);
    value = JSON.stringify(value);
    if (isPlatformBrowser(this._platformId)) {
      await Preferences.set({ key: key, value: value });
      this._cookieService.set(key, value, { expires: 28, path: "/", sameSite: "None", secure: true });
    }
    else {
      this._ssrCookieService.set(key, value, { expires: 28, path: "/", sameSite: "None", secure: true });
    }

    return true;
  }
  private async _get(key: string, prefix?: string): Promise<any> {
    key = _getKey(WzzStorage._prefix, prefix!, key);
    let value: string;

    if (isPlatformBrowser(this._platformId)) {
      value = (await Preferences.get({ key: key })).value!;
    }
    else {
      value = this._ssrCookieService.get(key);
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  private async _remove(key: string, prefix: string): Promise<any> {
    key = _getKey(WzzStorage._prefix, prefix, key);
    if (isPlatformBrowser(this._platformId)) {
      await Preferences.remove({ key: key });
      this._cookieService.delete(key);
    }
    else {
      this._ssrCookieService.delete(key);
    }

    return true;
  }

  private async _getEnv() {
    return new Promise<IEnv>((resolve) => {
      this._get(ENV, "").then((env) => {
        if (env)
          resolve(env);
        else
          resolve({
            language: this._translateService.currentLang,
            token: ""
          });
      });
    });
  }

  private async _setEnv(language?: string, token?: string) {
    language = language == undefined ? this._translateService.currentLang : language;
    token = token == undefined ? this._envExt.token : token;

    let env: IEnv = { language, token };
    return this._set(ENV, env, "");
  }

  static init(platformId: any, envExt: EnvExtension, cookieService: CookieService, ssrCookieService: SsrCookieService, translateService: TranslateService) {
    WzzStorage._instance = new WzzStorage(platformId, envExt, cookieService, ssrCookieService, translateService);
  }

  static resetPrefix(prefix: string | number) {
    WzzStorage._prefix = prefix + "_";
  }

  static set(key: string, value: any, prefix?: string) {
    return WzzStorage._instance._set(key, value, prefix);
  }

  static get(key: string, prefix?: string) {
    return WzzStorage._instance._get(key, prefix!);
  }

  static remove(key: string, prefix?: string) {
    return WzzStorage._instance._remove(key, prefix!);
  }

  static getEnv(): Promise<IEnv> {
    return WzzStorage._instance._getEnv();
  }
  static setEnv(language?: string, token?: string): Promise<any> {
    return WzzStorage._instance._setEnv(language, token);
  }
  static removeEnv() {
    return WzzStorage._instance._remove(ENV, "");
  }
  static setLang(val: string): Promise<any> {
    return WzzStorage.setEnv(val, undefined);
  }
  static setToken(val: string): Promise<any> {
    return WzzStorage.setEnv(undefined, val);
  }
  static setShopId(val: string) {
    return WzzStorage._instance._set(SHOP_ID, val);
  }
  static getShopId() {
    return WzzStorage._instance._get(SHOP_ID);
  }
}


