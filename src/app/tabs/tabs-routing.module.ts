import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'me',
        loadChildren: () =>
          import('./me/me.module').then(m => m.MePageModule)
      },
      {
        path: 'area-personale',
        loadChildren: () => import('./me/me.module').then(m => m.MePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
