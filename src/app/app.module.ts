import { NgModule, APP_INITIALIZER, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import LocalIt from '@angular/common/locales/it';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CanActivateWhenLoginGuard } from './guards/can-activate-when-login.guard';
import { CanActivateWhenUnloginGuard } from './guards/can-activate-when-unlogin.guard';

import { InitializerService } from './services/initializer.service';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { WzzMenuComponentModule } from './components/wzz-menu/wzz-menu.module';

const URL = environment.url;

registerLocaleData(LocalIt);
class TranslateBrowserLoader implements TranslateLoader {
    constructor(
        private http: HttpClient,
        private prefix: string = './assets/i18n/',
        private suffix: string = '.json',
    ) { }

    public getTranslation(lang: string): Observable<any> {
        // const key = makeStateKey<any>('transfer-translate-' + lang);
        // const data = this.transferState.get(key, null);

        // return data
        //   ? of(data)
        //   : new TranslateHttpLoader(this.http, this.prefix, `${this.suffix}`).getTranslation(lang);

        return new TranslateHttpLoader(this.http, this.prefix, `${this.suffix}`).getTranslation(lang);
    }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateBrowserLoader(http);
}

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot({
            backButtonText: ''
        }),
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        WzzMenuComponentModule
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: LOCALE_ID, useValue: 'it' },
        { provide: "baseUrl", useValue: `${URL}` },
        { provide: "apiUrl", useValue: `${URL}index.php?app_order_v3` },
        // { provide: LOCALE_ID, useValue: 'zh-Hans' },
        {
            provide: APP_INITIALIZER,
            useFactory: (provider: InitializerService) => function () { return provider.init(); },
            deps: [InitializerService],
            multi: true
        },
        CanActivateWhenLoginGuard,
        CanActivateWhenUnloginGuard,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('761720280134-cth11ro3e79f3qctgdmnvigdnd1g32g3.apps.googleusercontent.com', {
                            oneTapEnabled: false,
                            scopes: 'profile email'
                        }),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('4571072126344902', {
                            version: 'v18.0',
                            scope: 'email, public_profile',
                            fields: 'id,name,email',
                            return_scopes: true,
                            enable_profile_selector: true
                        }),
                    },
                    // {
                    //   id: AmazonLoginProvider.PROVIDER_ID,
                    //   provider: new AmazonLoginProvider(
                    //     'clientId'
                    //   ),
                    // },
                ],
            } as SocialAuthServiceConfig,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
