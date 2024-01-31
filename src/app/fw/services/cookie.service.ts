import { DOCUMENT, isPlatformServer } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
// import { REQUEST } from '@nguniversal/express-engine/tokens';

export const LANG_COOKIE = "lang";
export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const TOKEN_EXPIRE_TIME_COOKIE = "token_expire_time";
export const USER_ID_COOKIE = "user_id";
export const USER_AVATAR_COOKIE = "user_avatar";
export const USER_NAME_COOKIE = "user_name";
export const USER_EMAIL_COOKIE = "user_email";

@Injectable({
    providedIn: 'root'
})
export class CookieService {

    constructor(
        // @Optional() @Inject(REQUEST) private req: Request,
        @Inject(PLATFORM_ID) protected platformId: any,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    get(name: string) {
        if (isPlatformServer(this.platformId)) {
            // if (this.req)
            //     return this.req.cookies[name] ?? "";
            return "";
        }
        else {
            let ca: Array<string> = this.document.cookie.split(';');
            let caLen: number = ca.length;
            let cookieName = `${name}=`;
            let c: string;

            for (let i: number = 0; i < caLen; i += 1) {
                c = ca[i].replace(/^\s+/g, '');
                if (c.indexOf(cookieName) == 0) {
                    return c.substring(cookieName.length, c.length);
                }
            }
            return '';
        }
    }

    remove(name: string) {
        this.set(name, '', -1);
    }

    set(name: string, value: string | number, expireDays: number = 28, path: string = '/') {
        let d: Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires: string = `expires=${d.toUTCString()}`;
        let cpath: string = path ? `; path=${path}` : '';
        value = `${name}=${value}; ${expires}${cpath}; SameSite=None; Secure`;

        if (isPlatformServer(this.platformId)) {
            // this.req.cookies[name] = value;
        }
        else {
            this.document.cookie = value;
        }
    }
}