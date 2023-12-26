import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MePage } from './me.page';
import { CanActivateWhenLoginGuard } from 'src/app/guards/can-activate-when-login.guard';

const routes: Routes = [
  {
    path: '',
    component: MePage,
    children: [
      {
        path: 'profile',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'profilo',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'order',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/order/order.module').then(m => m.OrderPageModule)
      },
      {
        path: 'ordini',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/order/order.module').then(m => m.OrderPageModule)
      },
      {
        path: 'address',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/address/address.module').then(m => m.AddressPageModule)
      },
      {
        path: 'indirizzi',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/address/address.module').then(m => m.AddressPageModule)
      },
      {
        path: 'coupon',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/coupon/coupon.module').then(m => m.CouponPageModule)
      },
      {
        path: 'coupons',
        canActivate: [CanActivateWhenLoginGuard],
        data: {
          tabMode: true
        },
        loadChildren: () =>
          import('src/app/pages/coupon/coupon.module').then(m => m.CouponPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MePageRoutingModule { }
