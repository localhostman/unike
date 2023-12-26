import { IRes } from 'src/app/fw/interfaces/i-res';
import { IGetOpt } from 'src/app/fw/services/i-ajax-opt';
import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IPostOpt } from '../fw/services/i-ajax-opt';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "product";
  }

  async search(params?: any, opt?: IGetOpt): Promise<IRes | undefined> {
    this.page = opt?.page;
    this.pageSize = opt?.pageSize;
    params = Object.assign({
      page: this.page,
      pageSize: this.pageSize
    }, params);

    return this.get("search", this.needLogin, ``, params, opt);
  }
  public getRelativeFilter(params?: any, opt?: IGetOpt) {
    return this.get("relativeFilter", this.needLogin, ``, params, opt);
  }

  public getGifts(params?: any, opt?: IGetOpt) {
    return this.get("gifts", this.needLogin, ``, params, opt);
  }

  getCarts(data: any, opt?: IPostOpt) {
    return this.post("getCarts", false, "", data, opt);
  }

  getCurrentPagePageSize() {
    return [this.page, this.pageSize];
  }
}