import { CompBase } from './../../fw/bases/comp/comp.base';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ResizeExtension } from 'src/app/extensions/resize';
import { RouterLinkExtension } from 'src/app/extensions/router-link';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPage extends CompBase implements OnInit, AfterViewInit {

  protected seoNoIndex: boolean = true;

  constructor(
    public resizeExt: ResizeExtension,
    public rExt: RouterLinkExtension,
    protected route: ActivatedRoute,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  ngOnInit() {
    // this.rExt.generateRobots(true);
    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  async ngAfterViewInit() {
    await firstValueFrom(this.translateService.get("Home"));
    this.cdRef.detectChanges();
  }

}
