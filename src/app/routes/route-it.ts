import { SeoGuard } from '../guards/seo.guard';
import { GdprPageModule } from '../pages/gdpr/gdpr.module';
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
        data: {
          title: "Gestione del profilo | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      }]
    },
    {
      language: "order",
      translate: "ordini",
      routes: [{
        path: 'it/ordini',
        data: {
          title: "Gestione degli ordini | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/order/order.module').then(m => m.OrderPageModule)
      }]
    },
    {
      language: "address",
      translate: "indirizzi",
      routes: [{
        path: 'it/indirizzi',
        data: {
          title: "Gestione degli indirizzi | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/address/address.module').then(m => m.AddressPageModule)
      }]
    },
    {
      language: "coupon",
      translate: "coupons",
      routes: [{
        path: 'it/coupons',
        data: {
          title: "Gestione dei coupons | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
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
        data: {
          title: "Risultati di ricerca | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductPageModule)
      }]
    },
    {
      language: "product",
      translate: "prodotti",
      routes: [{
        path: 'it/prodotti/:categoryIdno',
        data: {
          refererId: "category",
          refererQueryParam: "category"
        },
        canActivate: [SeoGuard],
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
        data: {
          title: "Elenco degli omaggi | fasunidy.com"
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/gift/gift.module').then(m => m.GiftPageModule)
      }]
    },
    {
      language: "product-detail",
      translate: "prodotto",
      routes: [{
        path: 'it/prodotto/:id/:idno',
        data: {
          refererId: "product",
          refererParam: "id"
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
      }]
    },
    {
      language: "search",
      translate: "ricerca",
      routes: [{
        path: 'it/ricerca',
        data: {
          title: "Ricerca dei prodotti | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/search/search.module').then(m => m.SearchPageModule)
      }]
    },

    {
      language: "cart",
      translate: "carrello",
      routes: [{
        path: 'it/carrello',
        data: {
          title: "Carrello | fasunidy.com",
          index: false
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/cart/cart.module').then(m => m.CartPageModule)
      }]
    },
    {
      language: "tutorial",
      translate: "tutorial",
      routes: [{
        path: 'it/tutorial',
        data: {
          title: "Video tutorial e istruzioni | fasunidy.com"
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/tutorial/tutorial.module').then(m => m.TutorialPageModule)
      }]
    },
    {
      language: "about-us",
      translate: "chi-siamo",
      routes: [{
        path: 'it/chi-siamo',
        data: {
          title: "Chi siamo | fasunidy.com"
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/about-us/about-us.module').then(m => m.AboutUsPageModule)
      }]
    },
    {
      language: "contact",
      translate: "contattateci",
      routes: [{
        path: 'it/contattateci',
        data: {
          title: "Contattateci | fasunidy.com"
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/contact/contact.module').then(m => m.ContactPageModule)
      }]
    },
    {
      language: "faq",
      translate: "faq",
      routes: [{
        path: 'it/faq',
        data: {
          title: "FAQ | fasunidy.com",
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/faq/faq.module').then(m => m.FaqPageModule)
      }]
    },
    {
      language: "shipping-rule",
      translate: "regola-di-spedizione",
      routes: [{
        path: 'it/regola-di-spedizione',
        data: {
          title: "Shipping info | fasunidy.com",
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/shipping-rule/shipping-rule.module').then(m => m.ShippingRulePageModule)
      }]
    },
    {
      language: "return-rule",
      translate: "ordine-e-reso",
      routes: [{
        path: 'it/ordine-e-reso',
        data: {
          title: "Ordine e reso | fasunidy.com",
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/return-rule/return-rule.module').then(m => m.ReturnRulePageModule)
      }]
    },
    {
      language: "sale-condition",
      translate: "condizione-di-vendita",
      routes: [{
        path: 'it/condizione-di-vendita',
        data: {
          title: "Condizione di vendita | fasunidy.com",
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/sale-condition/sale-condition.module').then(m => m.SaleConditionPageModule)
      }]
    },
    {
      language: "privacy-policy",
      translate: "privacy-policy",
      routes: [{
        path: 'it/privacy-policy',
        data: {
          title: "Privacy policy | fasunidy.com",
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
      }]
    },
    {
      language: "cookie-policy",
      translate: "cookie-policy",
      routes: [{
        path: 'it/cookie-policy',
        data: {
          title: "Cookie policy | fasunidy.com",
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/cookie-policy/cookie-policy.module').then(m => m.CookiePolicyPageModule)
      }]
    },
    {
      language: "gdpr",
      translate: "gdpr",
      routes: [{
        path: 'it/gdpr',
        data: {
          title: "GDPR | fasunidy.com",
        },
        canActivate: [SeoGuard],
        loadChildren: () => import('../pages/gdpr/gdpr.module').then(m => GdprPageModule)
      }]
    },
  ];
}