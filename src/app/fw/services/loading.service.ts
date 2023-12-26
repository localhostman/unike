import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor(
    @Inject(PLATFORM_ID) protected platformId: any,
    private loadingCtrl: LoadingController
  ) { }
  async run(callback: Function, showBackdrop = true, showLoading = true, centered = false) {
    if (isPlatformServer(this.platformId)) {
      return await callback();
    }

    let res: any;
    const loading = showLoading ? await this.start(showBackdrop, centered) : undefined;
    try {
      res = await callback();
    } catch (e) {
      console.log(e);
    }
    await this.end(loading);

    return res;
  }
  async start(showBackdrop = true, centered = false): Promise<HTMLIonLoadingElement> {
    const target = await this.loadingCtrl.create({
      mode: 'ios',
      animated: showBackdrop,
      cssClass: showBackdrop ? 'wzz-loading-t2' : 'wzz-loading-t1' + (centered ? ' centered' : ''),
      spinner: showBackdrop ? "crescent" : "circular",
      showBackdrop: showBackdrop,
      duration: 60000
    });

    await target.present();

    return target;
  }
  async end(target?: HTMLIonLoadingElement) {
    if (target)
      await target.dismiss();
  }
}
