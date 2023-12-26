import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateReturnPage } from './create-return.page';

const routes: Routes = [
  {
    path: '',
    component: CreateReturnPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateReturnPageRoutingModule {}
