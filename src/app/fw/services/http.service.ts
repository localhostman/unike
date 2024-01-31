import { EnvExtension } from 'src/app/extensions/env';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, HttpResponse } from '@capacitor-community/http';
import { Platform } from '@ionic/angular';
import { IRes } from '../interfaces/i-res';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

const RETRY_CONNECT_NUM = 1;

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private _isNative: boolean;

    constructor(
        protected envExt: EnvExtension,
        protected platform: Platform,
        private http: HttpClient
    ) {
        // this._isNative = this.envExt.native;
        this._isNative = false;
    }

    async options(url: string, headers: any) {
        const res = this._run(
            () => Http.request({ url, headers, method: 'options', connectTimeout: 30000 }),
            () => this.http.get<IRes>(url, { headers: headers, withCredentials: true })
        );
        return res;
    }

    async get(url: string, headers: any, responseType: any = "json") {
        const res = this._run(
            () => Http.request({ url, headers, method: 'get', connectTimeout: 30000 }),
            () => this.http.get<any>(url, { headers, responseType, withCredentials: true })
        );
        return res;
    }

    async delete(url: string, headers: any, responseType: any = "json") {
        const res = this._run(
            () => Http.request({ url, headers, method: 'del', connectTimeout: 30000 }),
            () => this.http.delete<any>(url, { headers, responseType, withCredentials: true })
        );
        return res;
    }

    async put(url: string, formData: any, headers: any, responseType: any = "json") {
        const res = this._run(
            () => Http.request({ url, data: formData, headers, method: 'put', connectTimeout: 30000 }),
            () => this.http.put<any>(url, formData, { headers, responseType, withCredentials: true })
        );
        return res;
    }

    async post(url: string, formData: any, headers: any, responseType: any = "json", hasFile: boolean = false) {
        const res = this._run(
            () => Http.request({ url, data: formData, headers, method: 'post', connectTimeout: hasFile ? 300000 : 30000 }),
            () => this.http.post<any>(url, formData, { headers, responseType, withCredentials: true }),
            hasFile ? 300000 : 30000
        );
        return res;
    }

    async patch(url: string, formData: any, headers: any, responseType: any = "json") {
        const res = this._run(
            () => Http.request({ url, data: formData, headers, method: 'patch', connectTimeout: 30000 }),
            () => this.http.patch<any>(url, formData, { headers, responseType, withCredentials: true })
        );
        return res;
    }

    private async _run(fn1: Function, fn2: Function, fn2Timeout: number = 30000) {
        let ct = 0;
        let res: IRes | undefined = undefined;
        if (this._isNative) {
            do {
                try {
                    const response = await fn1();
                    if (this._resOk(response))
                        res = response.data;
                    Promise.reject();
                } catch (e) {
                    console.log(e);
                    ct++;
                }

            } while (ct < RETRY_CONNECT_NUM);
        }
        else {
            let http: Observable<IRes>;
            do {
                http = fn2().pipe(timeout(fn2Timeout), catchError((e, caught) => {
                    return of(null);
                }));

                res = await firstValueFrom(http);
                if (!res)
                    ct++;
            } while (!res && ct < RETRY_CONNECT_NUM);
        }

        return res;
    }

    private _resOk(res: HttpResponse) {
        return res.status == 200 || res.status == 304;
    }
}
