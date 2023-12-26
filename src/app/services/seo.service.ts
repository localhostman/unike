import { IGetOpt } from './../fw/services/i-ajax-opt';
import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IRes } from '../fw/interfaces/i-res';

const getKey = function (language: string, refererId: string, refererValue: string) {
  return `${language}_${refererId}_${refererValue}`;
};

@Injectable({
  providedIn: 'root'
})
export class SeoService extends BaseService {

  protected override needLogin: boolean = false;
  private _cache: any = {};

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "seo";
  }

  async getReferer(refererId: string, refererValue: string, opt?: IGetOpt) {
    const key = getKey(this.language, refererId, refererValue);
    let res: IRes | undefined = this._cache[key];
    if (!res) {
      res = await this.get("referer", this.needLogin, `refererId=${refererId}&refererValue=${refererValue}`, null, opt);
      this._cache[key] = res;
    }

    return res;
  }

}