import { EnvExtension } from './../extensions/env';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EventsService } from '../fw/dynamics/events.service';
import { RouterLinkExtension } from '../extensions/router-link';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CanActivateWhenLoginGuard {
  constructor(
    public routerLinkExt: RouterLinkExtension,
    public envExt: EnvExtension,
    private eventsService: EventsService,
    private translateService: TranslateService,
    private router: Router,
    private navCtrl: NavController,
  ) { }
  async canActivate(next: ActivatedRouteSnapshot) {
    let res: boolean = true;

    if (!this.envExt.isLogin()) {
      let url = this.router.url;

      if (url == "/") {
        this.navCtrl.navigateRoot(this.routerLinkExt.getRouterLink([this.translateService.currentLang, "home"]));
      }
      else {
        this.eventsService.login$.next();
      }

      res = false;
    }
    else {
      const me = this.envExt.me;
      const role: any = next.data["role"];

      if (!!role) {
        if (Array.isArray(role)) {
          if (role.indexOf(me?.TypeId) == -1)
            res = false;
        }
        else {
          if (role != me?.TypeId)
            res = false;
        }
      }
    }
    return res;
  }
}
