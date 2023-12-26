import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectGiftPage } from './select-gift.page';

const routes: Routes = [
  {
    path: '',
    component: SelectGiftPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectGiftPageRoutingModule {}
