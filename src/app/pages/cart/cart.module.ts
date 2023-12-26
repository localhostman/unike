import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { WzzHeaderComponentModule } from 'src/app/components/wzz-header/wzz-header.module';
import { WzzSubheaderComponentModule } from 'src/app/components/wzz-subheader/wzz-subheader.module';
import { WzzFooterComponentModule } from 'src/app/components/wzz-footer/wzz-footer.module';
import { EmptyComponentModule } from 'src/app/fw/components/empty/empty.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    TranslateModule,
    PipesModule,
    EmptyComponentModule,
    WzzHeaderComponentModule,
    WzzSubheaderComponentModule,
    WzzFooterComponentModule
  ],
  declarations: [CartPage]
})
export class CartPageModule { }
