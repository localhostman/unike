import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IAddress } from '../interfaces/i-data';
import { Subject } from 'rxjs';
import { IGetOpt, IPostOpt } from '../fw/services/i-ajax-opt';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends BaseService {

  protected override needLogin: boolean = true;

  update$ = new Subject<IAddress>();
  remove$ = new Subject<IAddress>();

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "address";
  }

  async getDefault(opt?: IGetOpt) {
    return this.get("default", true, ``, null, opt);
  }

  async updateDefault(id: number, opt?: IPostOpt) {
    return this.post("updateDefault", true, ``, { id: id }, opt);
  }

}