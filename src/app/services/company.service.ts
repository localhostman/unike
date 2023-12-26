import { IPostOpt } from './../fw/services/i-ajax-opt';
import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseService {

  protected override needLogin: boolean = true;

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "company";
  }

  override async update(requireLevel: any, data: any, opt?: IPostOpt) {
    return this.post("update", true, `requireLevel=${requireLevel ?? ""}`, data, opt);
  }

}