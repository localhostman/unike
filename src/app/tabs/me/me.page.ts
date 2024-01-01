import { DEFAULT_AVATAR } from './../../fw/const/const';
import { RouterLinkExtension } from '../../fw/extensions/router-link';
import { LangExtension } from '../../extensions/lang';
import { Component, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef, Injector } from '@angular/core';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { IUser } from 'src/app/interfaces/i-data';
import { MeService } from 'src/app/services/me.service';
import { ActionSheetController } from '@ionic/angular';
import { InitializerService } from 'src/app/services/initializer.service';
import { GettablePromoService } from 'src/app/services/gettable-promo.service';
import { Router } from '@angular/router';
import { ResizeExtension } from 'src/app/fw/extensions/resize';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MePage extends CompBase implements AfterViewInit {

  me?: IUser;
  defaultAvatar = DEFAULT_AVATAR;

  constructor(
    public resizeExt: ResizeExtension,
    public langExt: LangExtension,
    public routerLinkExt: RouterLinkExtension,
    protected initService: InitializerService,
    private gettablePromoService: GettablePromoService,
    private service: MeService,
    protected asCtrl: ActionSheetController,
    protected router: Router,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.me = this.envExt.me;

    this.visible = true;
    this.cdRef.detectChanges();

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  onImgError(evt: any) {
    evt.target.src = DEFAULT_AVATAR;
  }

  async onLogout() {
    this.getMessageExt().confirm({
      message: this.lang("您即将退出本次会话"),
      success: async () => {
        const res = await this.service.logout();
        this.gettablePromoService.setData(res?.extra);
        this.envExt.me = undefined;

        this.eventsService.loginStateChange$.next(false);
        this.getMessageExt().toast(this.lang("您已成功退出登录"));



        await this.router.navigateByUrl(this.routerLinkExt.getRouterLink([this.language, "home"]), { onSameUrlNavigation: "reload" });
      }
    });
  }
}
