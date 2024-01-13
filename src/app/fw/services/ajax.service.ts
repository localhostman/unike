import { FROM } from './../const/const';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Env } from '../dynamics/env';
import { HttpService } from './http.service';
import { IGetOpt, IPostOpt } from './i-ajax-opt';
import { FILE_PREFIX } from 'src/app/const/const';
import { EnvExtension } from 'src/app/extensions/env';
import { TranslateService } from '@ngx-translate/core';
import { Md5 } from 'ts-md5';
import { environment } from 'src/environments/environment';

const LANG_KEY = "lang";

const decode = (data: any) => {
  for (let key in data) {
    let val: any = data[key];
    if (val instanceof Object) {
      decode(data[key]);
    }
    else if (val) {
      switch (typeof (val)) {
        case "boolean":
          data[key] = val ? 1 : 0;
          break;
        case "string":
          data[key] = (val as String).toString().replace("+", "%2B");
          break;
      }
    }
  }
}

const encryptState = (str?: string): [number, string] => {
  const ts = Math.floor(Date.now() / 1000) + 60;
  return [ts, Md5.hashStr((str ?? "") + "Wujianbaichi" + ts)];
}

@Injectable({
  providedIn: 'root'
})

export class AjaxService {

  private _headers?: HttpHeaders;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: any,
    private _envExt: EnvExtension,
    protected translateService: TranslateService,
    private http: HttpService,
  ) {
  }

  updateHeaderAutorization(token?: string) {
    token = token ?? this._envExt.token;
    if (!!this._headers && token) {
      this.changeHeaders('token', token);
    }
  }

  changeHeaders(key: string, val: string) {
    if (!!this._headers)
      this._headers = this._headers.set(key, val);
  }

  changeHeaderLang(val: string) {
    this.changeHeaders(LANG_KEY, val);
  }

  getHeaders(url: string): HttpHeaders {
    if (!this._headers) {
      let headers: HttpHeaders = new HttpHeaders();
      let lang = this._envExt.language;
      headers = headers.set("app", environment.app);
      headers = headers.set(LANG_KEY, lang);
      headers = headers.set('from', FROM.PC);

      this._headers = headers;
      this.updateHeaderAutorization();
    }

    const [ts, state] = encryptState(url.split("?").pop());
    this._headers = this._headers.set("state", state.toString()).set("ts", ts.toString());

    return this._headers;
  }

  async get(url: string, opt?: IGetOpt): Promise<any> {
    let headers = this.getHeaders(url);
    return this.http.get(url, headers, opt?.responseType ?? "json");
  }

  async post(url: string, data: any, opt?: IPostOpt): Promise<any> {
    const headers = this.getHeaders(url);
    const formData = new FormData();
    const files = opt?.files;
    let hasFile: boolean = false;

    formData.append("data", JSON.stringify(data));

    files?.forEach((file: File, index: number) => {
      if (file) {
        hasFile = true;
        formData.append(FILE_PREFIX + index, file);
      }
    });

    return await this.http.post(url, formData, headers, opt?.responseType ?? "json", hasFile);
  }

  async delete(url: string, opt?: IGetOpt): Promise<any> {
    let headers = this.getHeaders(url);
    return await this.http.delete(url, headers, opt?.responseType ?? "json");
  }

}