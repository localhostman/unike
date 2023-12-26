import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnDetailPageRoutingModule } from './return-detail-routing.module';

import { ReturnDetailPage } from './return-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { LoginModalPageModule } from '../login-modal/login-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReturnDetailPageRoutingModule,
    TranslateModule,
    LoginModalPageModule
  ],
  declarations: [ReturnDetailPage]
})
export class ReturnDetailPageModule { }
