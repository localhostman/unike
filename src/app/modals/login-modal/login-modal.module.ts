import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginModalPage } from './login-modal.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
  ],
  declarations: [LoginModalPage]
})

export class LoginModalPageModule {
  static getPage(): typeof LoginModalPage {
    return LoginModalPage;
  }
}
