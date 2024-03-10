import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterLinkExtension } from '../fw/extensions/router-link';
import { SeoService } from '../services/seo.service';

@Injectable({
  providedIn: 'root'
})
export class SeoGuard {

  constructor(
    private _routerLinkExt: RouterLinkExtension,
    private _service: SeoService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let data = route.data;

    const refererId = data["refererId"];
    const index = data["index"];
    const includeJsonLD = data["includeJsonLD"];

    if (refererId) {
      const refererParam = data["refererParam"];
      const refererQueryParam = data["refererQueryParam"];
      let refererValue: string = "";
      if (refererParam) {
        refererValue = route.paramMap.get(refererParam)!;
      }
      else if (refererQueryParam) {
        refererValue = route.queryParamMap.get(refererQueryParam)!;
      }

      if (refererValue) {
        this._service.getReferer(refererId, refererValue).then((res) => {
          const data = res?.topics ?? {};
          this._routerLinkExt.generateSEOMeta(data["title"], data["desc"]);
        });
      }
    }
    else {
      this._routerLinkExt.generateSEOMeta(data["title"], data["desc"]);
    }

    if (index)
      this._routerLinkExt.generateRobots(!index);

    if (!includeJsonLD)
      this._routerLinkExt.removeSEOJSONLD();

    return true;
  }

}
