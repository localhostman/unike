import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingRulePage } from './shipping-rule.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingRulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingRulePageRoutingModule {}
