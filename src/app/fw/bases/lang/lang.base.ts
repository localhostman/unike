import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'

export class LangBase {
  language: string;
  protected languageChanged: boolean = false;

  protected translateService: TranslateService;
  constructor(
    protected injector: Injector
  ) {
    this.translateService = this.injector.get(TranslateService);
    this.language = this.translateService.currentLang;
  }
  lang(str: string, params: any = null) {
    return this.translateService.instant(str, params);
  }

}
