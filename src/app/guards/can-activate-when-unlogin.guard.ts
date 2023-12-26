import { EnvExtension } from 'src/app/extensions/env';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CanActivateWhenUnloginGuard  {
  constructor(
    public envExt: EnvExtension,
    private navCtrl: NavController) { }
  async canActivate() {
    if (this.envExt.isLogin()) {
      await this.navCtrl.navigateRoot("/tabs/home");
      return false;
    }
    return true;
  }
}
