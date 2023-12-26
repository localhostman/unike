import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnDetailPage } from './return-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnDetailPageRoutingModule {}
