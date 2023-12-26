import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { ResizeExtension } from 'src/app/extensions/resize';
import { RouterLinkExtension } from 'src/app/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { Animations } from 'src/app/utils/animations';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    Animations.accordionInit,
    Animations.accordionOpenClose
  ]
})
export class FaqPage extends PageBase implements AfterViewInit {

  override data: boolean[] = [
    true,
    true,
    true,
    true,
    true
  ];

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
