import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateReturnPageRoutingModule } from './create-return-routing.module';

import { CreateReturnPage } from './create-return.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateReturnPageRoutingModule,
    TranslateModule
  ],
  declarations: [CreateReturnPage]
})
export class CreateReturnPageModule { }
