import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { PROP_UNIT_LEN } from '../const/const';

@Injectable({
  providedIn: 'root'
})
export class ProductPropService extends BaseService {

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
  }

  override setData(data: any) {
    Object.keys(data).forEach(key => {
      const p2 = data[key];
      if (key.length > PROP_UNIT_LEN) {
        const tmp = key.substring(0, PROP_UNIT_LEN);
        const p1 = data[tmp];
        if (p1) {
          const children = p1.Children;
          if (!children) {
            p1.Children = [p2];
          }
          else {
            children.push(p2);
          }
        }
      }
      else {
        p2.Children = [];
      }
    });

    super.setData(data);
  }
}
