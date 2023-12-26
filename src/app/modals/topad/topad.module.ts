import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopadPageRoutingModule } from './topad-routing.module';

import { TopadPage } from './topad.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopadPageRoutingModule,
    TranslateModule
  ],
  declarations: [TopadPage]
})
export class TopadPageModule {
  static getPage(): typeof TopadPage {
    return TopadPage;
  }
}
