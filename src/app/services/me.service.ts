import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IPostOpt } from '../fw/services/i-ajax-opt';

@Injectable({
  providedIn: 'root'
})
export class MeService extends BaseService {

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "user";
  }

  contact(data: any, opt?: IPostOpt) {
    return this.post("contact", false, "debug=1", data, opt);
  }
  sendVerifyCode(data: any, opt?: IPostOpt) {
    return this.post("sendVerifyCode", false, "", data, opt);
  }
  unifiedLogin(data: any, opt?: IPostOpt) {
    return this.post("unifiedLogin", false, "", data, opt);
  }
  ggLogin(code: string, accessToken: string, opt?: IPostOpt) {
    return this.post("ggLogin", false, "", {
      "Code": code,
      "AccessToken": accessToken
    }, opt);
  }
  logout() {
    return this.post("logout", true, "", null);
  }
}
