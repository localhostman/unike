import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendOrderPage } from './send-order.page';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyComponentModule } from 'src/app/fw/components/empty/empty.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EmptyComponentModule
  ],
  declarations: [SendOrderPage]
})
export class SendOrderPageModule { }
