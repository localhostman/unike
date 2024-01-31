import { ICategory } from './../interfaces/i-data';
import { IGetOpt } from './../fw/services/i-ajax-opt';
import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseService } from '../fw/dynamics/base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  ready$ = new BehaviorSubject<ICategory[] | undefined>(undefined);
  externalChange$ = new Subject<string>();
  private _ref: { [key: string]: ICategory } = {};

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "category";
  }

  async init() {
    const data = await this.getData();
    this.ready$.next(data);
  }

  find(idno: string) {
    return this._ref[idno.toUpperCase()];
  }

  getRef() {
    return this._ref;
  }

  override async getData(opt?: IGetOpt) {
    const data = await super.getData(opt);
    this._ref = {};
    this.toRef(data, this._ref);
    return data;
  }

  toRef(data: ICategory[], ref: any) {
    data.forEach((item: ICategory) => {
      const idno = item.idno!;
      if (!ref[idno])
        ref[idno] = item;
      
      if (item.Children?.length)
        this.toRef(item.Children, ref);
    });
  }

}