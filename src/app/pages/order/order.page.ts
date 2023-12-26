import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';
import { ORDER_STATE } from 'src/app/const/const';
import { ResizeExtension } from 'src/app/extensions/resize';
import { RouterLinkExtension } from 'src/app/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { ALL } from 'src/app/fw/const/const';
import { IOrder } from 'src/app/interfaces/i-data';
import { CreateReturnPage } from 'src/app/modals/create-return/create-return.page';
import { OrderDetailPage } from 'src/app/modals/order-detail/order-detail.page';
import { ReturnDetailPage } from 'src/app/modals/return-detail/return-detail.page';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderPage extends PageBase implements OnInit, AfterViewInit {

  tabMode: boolean = false;
  states = ORDER_STATE;
  state: any;
  all = ALL;

  override data: IOrder[] = [];

  constructor(
    public routerLinkExt: RouterLinkExtension,
    public resizeExt: ResizeExtension,
    private service: OrderService,
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

    if (this.tabMode)
      this._renderer.addClass(this._hostEl.nativeElement, "tab");

    const snapshot = this.route.snapshot;
    const queryParamMap = snapshot.queryParamMap;

    const state = parseInt(queryParamMap.get("state") ?? "0");
    if (isNaN(state)) {
      this.state = ALL;
    }
    else {
      this.state = state;
    }

    await this.loadingService.run(async () => {
      await this.reload();

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));

    this.subscription.add(this.route.queryParams.pipe(skip(1)).subscribe(async (data) => {
      let state: any = parseInt(data["state"] ?? "0");

      const page = data["page"] ?? 1;
      if (isNaN(state))
        state = ALL;

      if (state == this.state && page == this.page)
        return;

      this.state = state;
      this.page = page;

      await this.loadingService.run(async () => {
        await this.reload(true);
      });

      this.cdRef.detectChanges();
    }));
  }

  onChangeState(evt: any) {
    const state = evt.detail.value;
    this.updateUrl({ state: state });
  }

  async onDetail(item: IOrder) {
    const modal = await this.getModalCtrl().create({
      component: OrderDetailPage,
      cssClass: "modal-t3",
      componentProps: {
        orderId: item.idno
      }
    });

    modal.onWillDismiss().then(({ data }) => {
      if (data) {
        item.RefundAmount = data.RefundAmount;
        this.cdRef.detectChanges();
      }
    });

    await modal.present();
  }

  async onCreateReturn(item: IOrder) {
    const modal = await this.getModalCtrl().create({
      component: CreateReturnPage,
      cssClass: "modal-t1",
      componentProps: {
        orderId: item.idno
      }
    });

    modal.onWillDismiss().then(({ data }) => {
      if (data) {
        item.RefundAmount = data.RefundAmount;
        this.cdRef.detectChanges();
      }
    });

    await modal.present();
  }

  async onReturnDetail(item: IOrder) {
    const modal = await this.getModalCtrl().create({
      component: ReturnDetailPage,
      cssClass: "modal-t3",
      componentProps: {
        orderId: item.idno
      }
    });

    await modal.present();
  }

  protected async reload(reset?: boolean) {
    if (reset)
      this.reset();

    const res = await this.service.getAll({
      stateId: this.state ? this.state : ORDER_STATE.INVIATO
    }, { page: this.page, pageSize: this.pageSize });

    const data = res?.topics ?? [];

    this.data = this.data.concat(data);
  }

  protected async paging(reset: boolean = false) {
    await this.reload(reset);
    this.updateUrl({ page: this.page });
  }

  //@override
  protected updateUrl(params?: any) {
    this.router.navigateByUrl(this.routerLinkExt.normalize(
      this.router.createUrlTree([], { relativeTo: this.route }).toString(),
      Object.assign({
        state: this.state,
        page: this.page == 1 ? null : this.page
      }, params)
    ));
  }

}
