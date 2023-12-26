import { PipesModule } from 'src/app/pipes/pipes.module';
import { WzzFooterComponentModule } from './../../components/wzz-footer/wzz-footer.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';
import { ProductComponentModule } from 'src/app/components/product/product.module';
import { WzzSubheaderComponentModule } from 'src/app/components/wzz-subheader/wzz-subheader.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HomePageRoutingModule,
    PipesModule,
    WzzSubheaderComponentModule,
    WzzFooterComponentModule,
    ProductComponentModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
