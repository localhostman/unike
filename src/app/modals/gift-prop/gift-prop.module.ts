import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftPropPageRoutingModule } from './gift-prop-routing.module';

import { GiftPropPage } from './gift-prop.page';
import { TranslateModule } from '@ngx-translate/core';
import { ProductPropComponentModule } from 'src/app/components/product-prop/product-prop.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftPropPageRoutingModule,
    TranslateModule,
    ProductPropComponentModule
  ],
  declarations: [GiftPropPage]
})
export class GiftPropPageModule { }
