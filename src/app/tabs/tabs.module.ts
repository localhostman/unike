import { PipesModule } from 'src/app/pipes/pipes.module';
import { WzzHeaderComponentModule } from './../components/wzz-header/wzz-header.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    TabsPageRoutingModule,
    WzzHeaderComponentModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
