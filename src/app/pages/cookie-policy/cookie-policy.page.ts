import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.page.html',
  styleUrls: ['./cookie-policy.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookiePolicyPage extends PageBase implements AfterViewInit {

  constructor(
    public routerLinkExt: RouterLinkExtension,
    public resizeExt: ResizeExtension,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    this.visible = true;
    this.cdRef.detectChanges();

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  protected async paging(reset: boolean = false) {
  }

}
