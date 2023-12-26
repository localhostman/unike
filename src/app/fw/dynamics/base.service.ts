import { Inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { EnvExtension } from 'src/app/extensions/env';
import { RES_TYPE } from '../const/const';
import { IRes } from '../interfaces/i-res';
import { AjaxService } from '../services/ajax.service';
import { IDeleteOpt, IGetOpt, IPostOpt } from '../services/i-ajax-opt';
import { Utility } from '../utils/utility';
import { EventsService } from './events.service';

@Injectable()
export class BaseService {
  protected reset$ = new Subject<any>();
  protected storagePrefix: string = "";
  protected envExt: EnvExtension;
  protected eventsService: EventsService;

  protected controllerName!: string;
  protected needLogin: boolean = false;
  protected language!: string;
  protected userIdno?: string;
  protected data: any;

  protected page?: number;
  protected pageSize?: number;

  constructor(
    @Inject("apiUrl") protected apiUrl: string,
    protected ajaxService: AjaxService,
    protected injector: Injector
  ) {
    this.envExt = injector.get(EnvExtension);
    this.eventsService = injector.get(EventsService);
  }
  hasData() {
    return this.data && this.envExt.language == this.language && (!this.needLogin || this.envExt.userIdno == this.userIdno);
  }

  setData(data: any) {
    this.data = data;
    this.language = this.envExt.language!;
    this.userIdno = this.envExt.userIdno!;
    this.reset$.next(data);
  }
  async getData(opt?: IGetOpt) {
    if (!this.hasData()) {
      const res = await this.getAll(null, opt);
      if (res) {
        this.language = this.envExt.language;
        this.userIdno = this.envExt.userIdno;
        this.data = res.topics;
      }
    }

    return this.data;
  }
  removeData() {
    this.setData(null);
  }
  reset() {
    this.data = null;
    this.reset$.next(null);
  }
  protected getStorageKey(prefix: string) {
    let storageKey: string;
    if (this.envExt.me)
      storageKey = prefix;
    else
      storageKey = prefix + "anonymous";
    return storageKey;
  }
  async getAll(params?: any, opt?: IGetOpt): Promise<IRes | undefined> {
    this.page = opt?.page;
    this.pageSize = opt?.pageSize;
    params = Object.assign({
      page: this.page,
      pageSize: this.pageSize
    }, params);

    return this.get("all", this.needLogin, ``, params, opt);
  }
  async getOne(id: number | string, params: any = null, opt?: IGetOpt) {
    return this.get("one", this.needLogin, `id=${id}`, params, opt);
  }
  async update(id: number | string, data: any, opt?: IPostOpt) {
    return this.post("update", this.needLogin, `id=${id}`, data, opt);
  }
  async remove(id: number | string, opt?: IDeleteOpt) {
    return this.delete("remove", this.needLogin, `id=${id}`, opt);
  }
  protected async get(opr: string, needLogin: boolean, url: string = "", params: any = null, opt?: IGetOpt) {
    const res = await this.ajaxService.get(Utility.generateQueryString(`${this.apiUrl}&${this.controllerName}&opr=${opr}&code=${needLogin ? "json" : "ujson"}${url ? "&" + url : ""}`, params), opt);
    return this.checkRes(res, true, !!opt?.ignoreCheckRes);
  }
  protected async post(opr: string, needLogin: boolean, url: string, data: any, opt?: IPostOpt) {
    const res = await this.ajaxService.post(`${this.apiUrl}&${this.controllerName}&opr=${opr}&code=${needLogin ? "json" : "ujson"}${url ? "&" + url : ""}`, data, opt);
    return this.checkRes(res, false, !!opt?.ignoreCheckRes);
  }
  protected async delete(opr: string, needLogin: boolean, url: string = "", params: any = null, opt?: IDeleteOpt) {
    const res = await this.ajaxService.delete(Utility.generateQueryString(`${this.apiUrl}&${this.controllerName}&opr=${opr}&code=${needLogin ? "json" : "ujson"}${url ? "&" + url : ""}`, params), opt);
    return this.checkRes(res, false, !!opt?.ignoreCheckRes);
  }
  protected checkRes(res: IRes, getMethod: boolean, ignoreCheckRes: boolean): IRes | undefined {
    if (ignoreCheckRes)
      return res;

    switch (res.type) {
      case RES_TYPE.SUCCESS:
        if (res.topics === false) {
          return undefined;
        }
        break;
      case RES_TYPE.NEED_LOGIN:
        if (!getMethod)
          this.eventsService.login$.next();
        return undefined;
      case RES_TYPE.FAIL:
        console.log(res.msg);
        this.eventsService.showAlert$.next(res?.msg!);
        return undefined;
    }
    return res;
  }
}