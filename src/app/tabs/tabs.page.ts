import { RouterLinkExtension } from '../fw/extensions/router-link';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { CompBase } from '../fw/bases/comp/comp.base';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsPage extends CompBase {

  constructor(
    public routerLinkExt: RouterLinkExtension,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

}
