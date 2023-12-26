import { Subject } from 'rxjs';
import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IPostOpt } from '../fw/services/i-ajax-opt';

export interface IOrderProductRef {
  [key: string]: { qt: number, propQt: any };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  private _note?: string;
  protected override needLogin: boolean = true;

  update$ = new Subject<void>();
  save$ = new Subject<IOrderProductRef>();

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "order";
  }

  setNote(val: string) {
    this._note = val;
  }

  getNote() {
    return this._note;
  }

  async paypalCapture(data: any, opt?: IPostOpt) {
    const res = await this.post("paypalCapture", true, "", data, opt);
    if (!res)
      Promise.reject();
    return res;
  }

  async updateReturn(data: any, opt?: IPostOpt) {
    return this.post("updateReturn", true, "", data, opt);
  }

  async updateReturnShipping(idno: string, data: any, opt?: IPostOpt) {
    return this.post("updateReturnShipping", true, `orderId=${idno}`, data, opt);
  }

}
