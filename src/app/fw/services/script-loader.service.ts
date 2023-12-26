import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  states: { [key: string]: boolean } = {};
  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  load(srcs: string[]) {
    let promises: any[] = [];
    srcs.forEach((src) => promises.push(this.loadOne(src)));
    return Promise.all(promises);
  }

  private loadOne(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      //resolve if already loaded
      if (!!this.states[src]) {
        resolve();
      }
      else {
        //load script
        const document = this.document;
        const script: any = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        if (script.readyState) {  //IE
          script.onreadystatechange = () => {
            if (script.readyState === "loaded" || script.readyState === "complete") {
              script.onreadystatechange = null;
              this.states[src] = true;
              resolve();
            }
          };
        } else {  //Others
          script.onload = () => {
            this.states[src] = true;
            resolve();
          };
        }
        script.onerror = (error: any) => reject();
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
