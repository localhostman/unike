import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Inject, Injector } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { MeService } from 'src/app/services/me.service';
import { ShopService } from 'src/app/services/shop.service';
import { Platform } from '@ionic/angular';
import { LoginBase } from 'src/app/bases/login/login.base';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalPage extends LoginBase { 

  constructor(
    @Inject("baseUrl") protected override baseUrl: string,
    protected override platform: Platform,
    protected override shopService: ShopService,
    protected override authService: SocialAuthService,
    protected override service: MeService,
    protected override fb: FormBuilder,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(baseUrl, platform, shopService, authService, service, fb, injector, cdRef);
  }

}
