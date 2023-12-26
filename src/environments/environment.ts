// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: "http://localhost:8070/",
  // url: "https://i.istarl.com/",
  firebaseConfig: {
    apiKey: "AIzaSyA6tHqmLzvhUYcCYEDyKQfEtGpjitRlAdE",
    authDomain: "istar-order.firebaseapp.com",
    databaseURL: "https://istar-order-default-rtdb.firebaseio.com",
    projectId: "istar-order",
    storageBucket: "istar-order.appspot.com",
    messagingSenderId: "761720280134",
    appId: "1:761720280134:web:300a927b829d820cd22647",
    measurementId: "G-6GKDBWLNPH"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
