import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IGetOpt } from '../fw/services/i-ajax-opt';

@Injectable({
  providedIn: 'root'
})
export class PromoService extends BaseService {

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "promo";
  }

  getUsable(params?: any, opt?: IGetOpt) {
    return this.get("getUsable", true, "", params, opt);
  }

  getAllByExtra(extra: string, amount: number, opt?: IGetOpt) {
    return this.get("allByExtra", true, `promoExtra=${extra}&amount=${amount}`, null, opt);
  }
}

