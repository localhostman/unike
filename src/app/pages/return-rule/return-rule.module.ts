import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnRulePageRoutingModule } from './return-rule-routing.module';

import { ReturnRulePage } from './return-rule.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { WzzHeaderComponentModule } from 'src/app/components/wzz-header/wzz-header.module';
import { WzzSubheaderComponentModule } from 'src/app/components/wzz-subheader/wzz-subheader.module';
import { WzzFooterComponentModule } from 'src/app/components/wzz-footer/wzz-footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnRulePageRoutingModule,
    TranslateModule,
    PipesModule,
    WzzHeaderComponentModule,
    WzzSubheaderComponentModule,
    WzzFooterComponentModule
  ],
  declarations: [ReturnRulePage]
})
export class ReturnRulePageModule { }
