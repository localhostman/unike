import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressPageRoutingModule } from './address-routing.module';

import { AddressPage } from './address.page';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyComponentModule } from 'src/app/fw/components/empty/empty.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressPageRoutingModule,
    TranslateModule,
    PipesModule,
    EmptyComponentModule
  ],
  declarations: [AddressPage]
})
export class AddressPageModule {}
