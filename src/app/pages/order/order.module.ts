import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyComponentModule } from 'src/app/fw/components/empty/empty.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    TranslateModule,
    PipesModule,
    EmptyComponentModule
  ],
  declarations: [OrderPage]
})
export class OrderPageModule {}
