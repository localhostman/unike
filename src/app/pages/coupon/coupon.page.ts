import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';
import { PROMO_STATE } from 'src/app/const/const';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { IPromo } from 'src/app/interfaces/i-data';
import { PromoService } from 'src/app/services/promo.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouponPage extends PageBase implements OnInit, AfterViewInit {

  @Input() override modalMode: boolean = false;
  @Input() override data!: IPromo[];
  @Input() selecteds!: IPromo[];

  tabMode: boolean = false;

  states = PROMO_STATE;
  state = PROMO_STATE.GOT;

  constructor(
    public routerLinkExt: RouterLinkExtension,
    public resizeExt: ResizeExtension,
    private service: PromoService,
    private router: Router,
    private route: ActivatedRoute,
    private _renderer: Renderer2,
    private _hostEl: ElementRef,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  ngOnInit() {
    this.tabMode = !!this.route.snapshot.data["tabMode"];
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    if (this.modalMode) {
      this.pushState();
      this._renderer.addClass(this._hostEl.nativeElement, "modal");
    }

    if (this.tabMode)
      this._renderer.addClass(this._hostEl.nativeElement, "tab");

    const snapshot = this.route.snapshot;
    const queryParamMap = snapshot.queryParamMap;

    const state = parseInt(queryParamMap.get("state") ?? "");
    if (isNaN(state)) {
      this.state = PROMO_STATE.GOT;
    }
    else {
      this.state = state;
    }

    await this.loadingService.run(async () => {
      await this.reload();

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.updateUrl(null, true);

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));

    this.subscription.add(this.route.queryParams.pipe(skip(1)).subscribe(async (data) => {
      let state: any = parseInt(data["state"]);

      const page = data["page"] ?? 1;
      if (isNaN(state))
        state = PROMO_STATE.GOT;

      if (state == this.state && page == this.page)
        return;

      this.state = state;
      this.page = page;

      await this.loadingService.run(async () => {
        await this.reload();
      });

      this.cdRef.detectChanges();
    }));
  }

  onClose() {
    this.getModalCtrl().dismiss();
  }

  onChangeState(evt: any) {
    const state = evt.detail.value;
    this.updateUrl({ state: state });
  }

  onClick(item: IPromo) {
    if (!this.modalMode)
      return;

    this.getModalCtrl().dismiss([item]);
  }

  protected async reload() {
    if (this.modalMode) {
      this.data.forEach((item1) => {
        item1.selected = false;
        this.selecteds?.forEach(item2 => {
          if (item1.id == item2.id) {
            item1.selected = true;
          }
        });
      });
    }
    else {
      const res = await this.service.getUsable({
        stateId: this.state,
      });

      const topics = res?.topics ?? [];
      this.data = topics[1] ?? [];
    }
  }

  protected async paging(reset: boolean = false) {
  }

  //@override
  protected updateUrl(params?: any, replaceUrl?: boolean) {
    this.router.navigateByUrl(this.routerLinkExt.normalize(
      this.router.createUrlTree([], { relativeTo: this.route }).toString(),
      Object.assign({
        state: this.state,
        page: this.page == 1 ? null : this.page
      }, params)
    ), { replaceUrl: !!replaceUrl });
  }

}
