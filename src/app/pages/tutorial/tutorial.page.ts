import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ResizeExtension } from 'src/app/extensions/resize';
import { RouterLinkExtension } from 'src/app/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorialPage extends PageBase implements AfterViewInit {

  v1VideoEl?: HTMLVideoElement;
  @ViewChild("v1VideoRef") v1VideoRef?: ElementRef;

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

    this.v1VideoEl = this.v1VideoRef?.nativeElement;

    this.cdRef.detectChanges();

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  protected async paging(reset: boolean = false) {
  }

}
