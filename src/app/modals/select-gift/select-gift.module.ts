import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectGiftPageRoutingModule } from './select-gift-routing.module';

import { SelectGiftPage } from './select-gift.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ProductComponentModule } from 'src/app/components/product/product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectGiftPageRoutingModule,
    TranslateModule,
    PipesModule,
    ProductComponentModule,
  ],
  declarations: [SelectGiftPage]
})
export class SelectGiftPageModule { }
