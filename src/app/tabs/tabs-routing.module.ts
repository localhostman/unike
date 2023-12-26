import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SeoGuard } from '../guards/seo.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        data: {
          title: "Fasunidy, Fashion and unique lady"
        },
        canActivate: [SeoGuard],
        loadChildren: () =>
          import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'me',
        data: {
          title: "Account | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
        loadChildren: () =>
          import('./me/me.module').then(m => m.MePageModule)
      },
      {
        path: 'area-personale',
        data: {
          title: "Area personale | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
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
