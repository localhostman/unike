import { ITranslateRoute } from './route';

export function getRoutes(mobile: boolean): ITranslateRoute[] {
  return [
    {
      language: "tabs",
      translate: "cn",
      routes: [{
        path: 'cn',
        loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule)
      }]
    },
    {
      language: "product",
      translate: "products",
      routes: [{
        path: 'cn/products',
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductPageModule)
      }]
    },
    {
      language: "product-detail",
      translate: "product",
      routes: [{
        path: 'cn/product/:idno',
        loadChildren: () => import('../pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
      }]
    }
  ];
}