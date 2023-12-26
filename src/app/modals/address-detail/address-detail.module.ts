import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressDetailPage } from './address-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { SelectComponentModule } from 'src/app/fw/components/select/select.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    SelectComponentModule
  ],
  declarations: [AddressDetailPage]
})
export class AddressDetailPageModule {}
