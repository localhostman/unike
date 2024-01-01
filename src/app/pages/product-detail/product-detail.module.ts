import { WzzSubheaderComponentModule } from 'src/app/components/wzz-subheader/wzz-subheader.module';
import { WzzFooterComponentModule } from './../../components/wzz-footer/wzz-footer.module';
import { ProductComponentModule } from './../../components/product/product.module';
import { ProductPropComponentModule } from './../../components/product-prop/product-prop.module';
import { WzzHeaderComponentModule } from './../../components/wzz-header/wzz-header.module';
import { ZoomImageComponentModule } from './../../components/zoom-image/zoom-image.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { CartComponentModule } from 'src/app/components/cart/cart.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ProductDetailPageRoutingModule,
    PipesModule,
    ZoomImageComponentModule,
    WzzHeaderComponentModule,
    WzzSubheaderComponentModule,
    WzzFooterComponentModule,
    ProductComponentModule,
    ProductPropComponentModule,
    ZoomImageComponentModule,
    CartComponentModule
  ],
  declarations: [ProductDetailPage]
})
export class ProductDetailPageModule { }
