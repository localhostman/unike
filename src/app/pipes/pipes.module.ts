import { RouterLinkPipe, CategoryRouterLinkPipe, ProductDetailRouterLinkPipe } from './router-link.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZhNumberPipe } from './zh-number.pipe';
import { WeightPipe } from './weight.pipe';
import { MaxNumPipe } from './max-num.pipe';
import { ValidDatePipe } from './valid-date.pipe';
import { ProductSupportDeliveryPipe } from './product-support-delivery.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RouterLinkPipe,
    CategoryRouterLinkPipe,
    ProductDetailRouterLinkPipe,
    ZhNumberPipe,
    WeightPipe,
    MaxNumPipe,
    ValidDatePipe,
    ProductSupportDeliveryPipe
  ],
  exports: [
    RouterLinkPipe,
    CategoryRouterLinkPipe,
    ProductDetailRouterLinkPipe,
    ZhNumberPipe,
    WeightPipe,
    MaxNumPipe,
    ValidDatePipe,
    ProductSupportDeliveryPipe
  ]
})
export class PipesModule { }
