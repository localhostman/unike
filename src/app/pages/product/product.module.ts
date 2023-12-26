import { WzzFooterComponentModule } from './../../components/wzz-footer/wzz-footer.module';
import { PageComponentModule } from './../../fw/components/page/page.module';
import { WzzHeaderComponentModule } from './../../components/wzz-header/wzz-header.module';
import { ProductComponentModule } from './../../components/product/product.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { WzzSubheaderComponentModule } from 'src/app/components/wzz-subheader/wzz-subheader.module';
import { EmptyComponentModule } from 'src/app/fw/components/empty/empty.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ProductPageRoutingModule,
    PipesModule,
    EmptyComponentModule,
    PageComponentModule,
    WzzHeaderComponentModule,
    WzzSubheaderComponentModule,
    WzzFooterComponentModule,
    ProductComponentModule,
  ],
  declarations: [ProductPage]
})
export class ProductPageModule { }
