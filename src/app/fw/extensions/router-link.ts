import { IProduct, ICategory } from '../../interfaces/i-data';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Route } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { skip } from 'rxjs';
import { Env } from '../dynamics/env';
import { ISEO } from '../../interfaces/i-data';
import { getRoutes, ITranslateRoute } from '../../routes/route';

const _translate = function (str: string | number, langRef: any, language: string, slug: string = "", slugRef: any = {}) {
    str = str.toString().toLowerCase();
    language = language.toLowerCase();
    str = (str + "").replace("/", "");
    const slugRefLang = slugRef[language];
    return slug != "" && slug == str ? (slugRefLang ? slugRefLang : slug) : (langRef[str] ?? (str))
}

const _iteratorTranslateRoutes = function (translateRoutes: ITranslateRoute[], obj1: any, arr1: any[], langInvertCollection: any) {
    translateRoutes.forEach((translateRoute) => {
        if (translateRoute) {
            const language = translateRoute.language;
            const translate = translateRoute.translate;
            obj1[language] = translate;

            const children = translateRoute.children;

            translateRoute.routes?.forEach((route) => {
                if (children) {
                    route.children = [];
                    _iteratorTranslateRoutes(children, obj1, route.children, langInvertCollection);
                }

                arr1.push(route);
            });

            langInvertCollection[translate] = language;
        }
    });
}

@Injectable({
    providedIn: 'root'
})
export class RouterLinkExtension {

    private _langCollection: any;
    private _langInvertCollection: any;
    private _routes!: { [key: string]: Route[] };
    private _language!: string;

    constructor(
        private _translateService: TranslateService,
        private rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document: Document,
        private _titleService: Title,
        private _metaService: Meta,
        private _navCtrl: NavController
    ) {
        this._translateService.onLangChange.pipe(skip(1)).subscribe((val) => {
            this._language = val.lang;
        });
    }

    init(language: string, mobile: boolean) {
        this._language = language;
        const routeRef: any = getRoutes(mobile);
        this._routes = {};
        this._langCollection = {};
        this._langInvertCollection = {};
        Object.keys(routeRef).forEach((lang: string) => {
            const translateRoutes: ITranslateRoute[] = routeRef[lang];
            const obj1 = {};//langCollection instance
            const arr1: any[] = [];//route instance

            _iteratorTranslateRoutes(translateRoutes, obj1, arr1, this._langInvertCollection);

            this._langCollection[lang] = obj1;
            this._routes[lang] = arr1;
        });
    }

    get routes() {
        return this._routes;
    }

    async toProductDetail(product: IProduct) {
        await this._navCtrl.navigateForward(this.getProductDetailRouterLink(product));
    };

    normalize(url: string, param?: { [key: string]: any }) {
        let href = "";

        if (!!param) {
            Object.keys(param).forEach((key) => {
                const value = param[key];
                if (value)
                    href += `&${key}=${value}`;
            });
        }

        return url + (href ? "?" + href : "");
    }

    toString(params: any[] | string, startWithSlash: boolean = true) {
        if (typeof params == "string")
            return params.toLowerCase();
        const str = params.join("/").toLowerCase();
        return startWithSlash && !str.startsWith("/") ? `/${str}` : str;
    }

    translate(params: any[] | string, language?: string, slug: string = "", slugRef: any = {}) {
        if (!params)
            return [];

        language = language ?? this._language;

        const o: string[] = [];
        const langRef = this._langCollection[language] ?? {};

        if (typeof params == "string") {
            return _translate(params, langRef, language, slug, slugRef);
        }
        else {
            params.forEach(str => {
                str = (str + "").replace("/", "");
                str = _translate(str, langRef, language!, slug, slugRef);
                if (str)
                    o.push(str);
            });
        }
        return o;
    };

    invertTranslate(params: any[] | string) {
        if (typeof params == "string") {
            params = params.split("/");
        }
        return params.map((param) => this._langInvertCollection[param] ?? param);
    }

    invertRouterLink(params: any[] | string, language?: string) {
        const o = this.invertTranslate(params);
        return this.getRouterLink(o, language);
    }

    getRouterLink(params: any[], language?: string) {
        const r = this.translate(params, language);
        const str = this.toString(r);
        return str;
    }

    getProductDetailRouterLink(product: IProduct) {
        return this.toString(this.translate([this._language, 'product-detail', product.idno], this._language));
    }

    getCategoryRouterLink(category: ICategory, stringfy: boolean = true) {
        // return this.toString(this.translate([this._language, 'product', category.id, page, category.slug], this._language));
        const categoryIdno = category.idno ?? "";
        const o = this.translate([this._language, 'product', categoryIdno], this._language);

        if (stringfy)
            return this.toString(o);
        return ["/"].concat(o);
    }

    generateSEO(seo: ISEO, noindex: boolean, resevedParams: any[] = []) {
        this.generateSEOMeta(seo.title, seo.description);
        this.generateSEOLink(noindex, resevedParams, seo?.slug ?? "", seo?.slugs ?? {});
    }

    generateSEOMeta(title: string, desc: string) {
        if (title)
            this._titleService.setTitle(title);

        if (desc)
            this._metaService.updateTag({ name: "description", content: desc });
    }

    generateSEOLink(noindex: boolean, resevedParams: any[] = [], slug: string = "", slugRef: any = {}) {
        const location = this.document.location;
        const protocol = "https:";
        const hostname = location.hostname;
        const pathname = location.pathname;
        const paths = pathname.split("/");
        let search = location.search;
        search = search.substring(1, search.length);

        this.generateRobots(noindex);

        const params = paths.map((param) => this._langInvertCollection[param] ?? (param));
        const renderer = this.rendererFactory.createRenderer(this.document, {
            id: '-1',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
        });

        let link: any, url: string;
        const head = this.document.head;
        const links = head.querySelectorAll("link[hreflang]");
        const linkRef: { [key: string]: HTMLLinkElement } = {};
        let langProp: string;
        links.forEach((link: any) => {
            langProp = link.getAttribute("hreflang");
            linkRef[langProp] = link;
        });

        Env.POSSIBLE_LANGS.forEach((language: string) => {
            url = `${protocol}//${hostname}${this.toString(this.translate(params, language, slug, slugRef), true)}${search ? "?" + search : ""}`;
            link = linkRef[language];
            if (link) {
                renderer.setAttribute(link, "href", url);
            }
            else {
                link = renderer.createElement('link');
                renderer.setAttribute(link, "rel", "alternate");
                renderer.setAttribute(link, "hreflang", language);
                renderer.setAttribute(link, "href", url);
                renderer.appendChild(head, link);
            }
        });

        const searchRef = search.split("&").reduce((ref: any, item) => {
            const tmp = item.split("=");
            ref[tmp[0]] = tmp[1];
            return ref;
        }, {});

        let key: string, value: string;
        const o: any[] = [];
        resevedParams.forEach((item) => {
            key = item.key;
            value = searchRef[key];
            if (value) {
                o.push({ key: key, value: value });
            }
            else {
                o.push({ key: key, value: item.value });
            }
        });
        search = o.map(item => `${item.key}=${item.value}`).join("&");

        link = head.querySelector("link[rel=canonical]");
        if (link)
            renderer.setAttribute(link, "href", url = `${protocol}//${hostname}${pathname}${search ? "?" + search : ""}`);
    }

    generateRobots(noindex: boolean) {
        if (noindex) {
            this._metaService.addTag({ name: "robots", content: "noindex" });
        }
        else {
            this._metaService.removeTag("name='robots'");
        }
    }

}