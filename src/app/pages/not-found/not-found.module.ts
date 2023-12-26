import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { WzzHeaderComponentModule } from './../../components/wzz-header/wzz-header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotFoundPageRoutingModule } from './not-found-routing.module';

import { NotFoundPage } from './not-found.page';
import { EmptyComponentModule } from 'src/app/fw/components/empty/empty.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotFoundPageRoutingModule,
    TranslateModule,
    PipesModule,
    EmptyComponentModule,
    WzzHeaderComponentModule
  ],
  declarations: [NotFoundPage]
})
export class NotFoundPageModule {}
