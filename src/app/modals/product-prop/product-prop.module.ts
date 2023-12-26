
import { ProductPropComponentModule } from '../../components/product-prop/product-prop.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPropPage } from './product-prop.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ProductPropComponentModule
  ],
  declarations: [ProductPropPage]
})
export class ProductPropPageModule { }
