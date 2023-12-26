import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponPageRoutingModule } from './coupon-routing.module';

import { CouponPage } from './coupon.page';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyComponentModule } from 'src/app/fw/components/empty/empty.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponPageRoutingModule,
    TranslateModule,
    PipesModule,
    EmptyComponentModule
  ],
  declarations: [CouponPage]
})
export class CouponPageModule {}
