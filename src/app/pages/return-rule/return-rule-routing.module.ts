import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnRulePage } from './return-rule.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnRulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnRulePageRoutingModule {}
