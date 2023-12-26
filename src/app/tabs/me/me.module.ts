import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MePageRoutingModule } from './me-routing.module';

import { MePage } from './me.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { WzzHeaderComponentModule } from 'src/app/components/wzz-header/wzz-header.module';
import { WzzSubheaderComponentModule } from 'src/app/components/wzz-subheader/wzz-subheader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MePageRoutingModule,
    TranslateModule,
    PipesModule,
    WzzHeaderComponentModule,
    WzzSubheaderComponentModule,
  ],
  declarations: [MePage]
})
export class MePageModule { }
