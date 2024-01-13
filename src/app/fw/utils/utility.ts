import { IBrowser } from '../interfaces/i-browser';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';
import { Env } from '../dynamics/env';

export class Utility {
  private static daysOfMonth: number[] = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  private static browser: IBrowser;
  static passwordReg = /^(\S){4,}/;

  constructor() { }
  static getQueryParams(): any {
    let search: string = window.location.search;
    if (search == "")
      return null;
    let arr: Array<string> = search.split("?");
    if (arr.length <= 1)
      return null;
    arr = arr[1].split("&");
    let obj: any = {};
    arr.forEach((item) => {
      let tmp: Array<string> = item.split("=");
      if (tmp.length == 1)
        obj[tmp[0]] = "";
      else
        obj[tmp[0]] = tmp[1];
    });
    return obj;
  }
  static generateQueryString(url: string, queryParams?: { [key: string]: string | number }): string {
    if (!!queryParams) {
      let tmp: any;
      for (let key in queryParams) {
        tmp = queryParams[key];
        if (tmp) {
          if (Array.isArray(tmp)) {
            tmp.forEach((item) => {
              if (item != undefined)
                url += "&" + key + "[]=" + item;
            });
          }
          else {
            url += "&" + key + "=" + tmp;
          }
        }
      }
    }

    return url;
  }

  static clone(data: any) {
    if (!data)
      return null;

    return JSON.parse(JSON.stringify(data));
  }
  static passByReference(dest: any, src: any, partial: boolean = false, excepts: string[] = []) {
    if (partial) {
      let keys: string[] = Object.keys(src);
      keys.forEach((key: string) => {
        if (excepts.indexOf(key) == -1) {
          dest[key] = src[key];
        }
      });
    }
    else {
      Object.assign(dest, src);
    }
  }
  static isEqual(data1: any, data2: any, partial: boolean = true) {
    if (partial) {
      let keys: Array<string> = Object.keys(data2);
      let value1: any;
      let value2: any;
      return keys.every((key: string) => {
        value1 = data1[key];
        value2 = data2[key];
        if (typeof value2 === "boolean") {
          value1 = +value1;
          value2 = +value2;
        }

        return JSON.stringify(value1) == JSON.stringify(value2);
      });
    }
    else
      return JSON.stringify(data1) == JSON.stringify(data2);
  }
  static normalizePrice(price: number) {
    return price.toFixed(2).replace(".", ",");
  }
  static getOffsetTop(el: { offsetTop: number, offsetParent: any }): number {
    if (!!el.offsetParent)
      return el.offsetTop + Utility.getOffsetTop(el.offsetParent);
    return el.offsetTop;
  }
  static getOffsetLeft(el: { offsetLeft: number, offsetParent: any }): number {
    if (!!el.offsetParent)
      return el.offsetLeft + Utility.getOffsetLeft(el.offsetParent);
    return el.offsetLeft;
  }
  static markFormAsTouched(form: UntypedFormGroup) {
    let keys: Array<string> = Object.keys(form.controls);
    keys.forEach((key: string) => {
      let control: AbstractControl = form.controls[key];
      if (control.invalid)
        control.markAsTouched();
    });
  }
  static formControlRequired(control: AbstractControl) {
    if (!control.validator)
      return false;

    let validator = control.validator({} as AbstractControl);
    return validator?.["required"];
  }

  static copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.style.zIndex = '99999999';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  static getLastDayOfMonth(year: number, month: number): number {
    if (month == 2) {
      if (year % 100 == 0) {
        if (year % 400 == 0)
          return 29;
        return 28;
      }
      else {
        if (year % 4 == 0)
          return 29;
        return 28;
      }
    }
    else
      return Utility.daysOfMonth[month];
  }

  static getLangForHtmlAttribute(language: string) {
    switch (language) {
      case Env.CN:
        return "zh-cmn-Hans";
      default:
        return language.toLowerCase();
    }
  }
}
