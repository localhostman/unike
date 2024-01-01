import { Pipe, PipeTransform } from '@angular/core';
import { RouterLinkExtension } from '../fw/extensions/router-link';

@Pipe({
  name: 'routerLink'
})
export class RouterLinkPipe implements PipeTransform {

  constructor(private _rExt: RouterLinkExtension) {

  }

  transform(params: any[]): string {
    return this._rExt.getRouterLink(params);
  }

}

@Pipe({
  name: 'categoryRouterLink'
})
export class CategoryRouterLinkPipe implements PipeTransform {

  constructor(private _rExt: RouterLinkExtension) {

  }

  transform(category: any): string {
    return this._rExt.getCategoryRouterLink(category, true) as string;
  }

}

@Pipe({
  name: 'productDetailRouterLink'
})
export class ProductDetailRouterLinkPipe implements PipeTransform {

  constructor(private _rExt: RouterLinkExtension) {

  }

  transform(product: any): string {
    return this._rExt.getProductDetailRouterLink(product);
  }

}