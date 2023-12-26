import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftPropPage } from './gift-prop.page';

const routes: Routes = [
  {
    path: '',
    component: GiftPropPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftPropPageRoutingModule {}
