import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopadPage } from './topad.page';

const routes: Routes = [
  {
    path: '',
    component: TopadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopadPageRoutingModule {}
