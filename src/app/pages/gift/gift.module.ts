import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftPageRoutingModule } from './gift-routing.module';

import { GiftPage } from './gift.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { WzzHeaderComponentModule } from 'src/app/components/wzz-header/wzz-header.module';
import { WzzSubheaderComponentModule } from 'src/app/components/wzz-subheader/wzz-subheader.module';
import { WzzFooterComponentModule } from 'src/app/components/wzz-footer/wzz-footer.module';
import { ProductComponentModule } from 'src/app/components/product/product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftPageRoutingModule,
    TranslateModule,
    PipesModule,
    WzzHeaderComponentModule,
    WzzSubheaderComponentModule,
    WzzFooterComponentModule,
    ProductComponentModule
  ],
  declarations: [GiftPage]
})
export class GiftPageModule { }
