import { ITranslateRoute } from './route';

export function getRoutes(mobile: boolean): ITranslateRoute[] {
  return [
    {
      language: "category",
      translate: "categorie",
    },
    {
      language: "me",
      translate: "area-personale",
    },
    {
      language: "profile",
      translate: "profilo",
      routes: [{
        path: 'it/profilo',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      }]
    },
    {
      language: "order",
      translate: "ordini",
      routes: [{
        path: 'it/ordini',
        loadChildren: () => import('../pages/order/order.module').then(m => m.OrderPageModule)
      }]
    },
    {
      language: "address",
      translate: "indirizzi",
      routes: [{
        path: 'it/indirizzi',
        loadChildren: () => import('../pages/address/address.module').then(m => m.AddressPageModule)
      }]
    },
    {
      language: "coupon",
      translate: "coupons",
      routes: [{
        path: 'it/coupons',
        loadChildren: () => import('../pages/coupon/coupon.module').then(m => m.CouponPageModule)
      }]
    },
    {
      language: "tabs",
      translate: "it",
      routes: [{
        path: 'it',
        loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule)
      }]
    },
    {
      language: "searches",
      translate: "ricerchi",
      routes: [{
        path: 'it/ricerchi',
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductPageModule)
      }]
    },
    {
      language: "product",
      translate: "prodotti",
      routes: [{
        path: 'it/prodotti/:categoryIdno',
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductPageModule)
      }]
    },
    {
      language: "event",
      translate: "eventi",
      routes: [{
        path: 'it/eventi/:promoId',
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductPageModule)
      }]
    },
    {
      language: "gift",
      translate: "omaggi",
      routes: [{
        path: 'it/omaggi',
        loadChildren: () => import('../pages/gift/gift.module').then(m => m.GiftPageModule)
      }]
    },
    {
      language: "product-detail",
      translate: "prodotto",
      routes: [{
        path: 'it/prodotto/:id/:idno',
        loadChildren: () => import('../pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
      }]
    },
    {
      language: "search",
      translate: "ricerca",
      routes: [{
        path: 'it/ricerca',
        loadChildren: () => import('../pages/search/search.module').then(m => m.SearchPageModule)
      }]
    },

    {
      language: "cart",
      translate: "carrello",
      routes: [{
        path: 'it/carrello',
        loadChildren: () => import('../pages/cart/cart.module').then(m => m.CartPageModule)
      }]
    },
    {
      language: "tutorial",
      translate: "tutorial",
      routes: [{
        path: 'it/tutorial',
        loadChildren: () => import('../pages/tutorial/tutorial.module').then(m => m.TutorialPageModule)
      }]
    },
    {
      language: "about-us",
      translate: "chi-siamo",
      routes: [{
        path: 'it/chi-siamo',
        loadChildren: () => import('../pages/about-us/about-us.module').then(m => m.AboutUsPageModule)
      }]
    },
    {
      language: "contact",
      translate: "contattateci",
      routes: [{
        path: 'it/contattateci',
        loadChildren: () => import('../pages/contact/contact.module').then(m => m.ContactPageModule)
      }]
    },
    {
      language: "faq",
      translate: "faq",
      routes: [{
        path: 'it/faq',
        loadChildren: () => import('../pages/faq/faq.module').then(m => m.FaqPageModule)
      }]
    },
    {
      language: "shipping-rule",
      translate: "regola-di-spedizione",
      routes: [{
        path: 'it/regola-di-spedizione',
        loadChildren: () => import('../pages/shipping-rule/shipping-rule.module').then(m => m.ShippingRulePageModule)
      }]
    },
    {
      language: "return-rule",
      translate: "ordine-e-reso",
      routes: [{
        path: 'it/ordine-e-reso',
        loadChildren: () => import('../pages/return-rule/return-rule.module').then(m => m.ReturnRulePageModule)
      }]
    },
    {
      language: "sale-condition",
      translate: "condizione-di-vendita",
      routes: [{
        path: 'it/condizione-di-vendita',
        loadChildren: () => import('../pages/sale-condition/sale-condition.module').then(m => m.SaleConditionPageModule)
      }]
    },
  ];
}