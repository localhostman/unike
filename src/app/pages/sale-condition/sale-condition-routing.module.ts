import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaleConditionPage } from './sale-condition.page';

const routes: Routes = [
  {
    path: '',
    component: SaleConditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleConditionPageRoutingModule {}
