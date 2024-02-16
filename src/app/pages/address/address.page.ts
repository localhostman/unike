import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { FAIL_MESSAGE } from 'src/app/fw/const/const';
import { Utility } from 'src/app/fw/utils/utility';
import { IAddress } from 'src/app/interfaces/i-data';
import { AddressDetailPage } from 'src/app/modals/address-detail/address-detail.page';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressPage extends PageBase implements OnInit, AfterViewInit, OnDestroy {

  @Input() override modalMode: boolean = false;
  tabMode: boolean = false;

  defaultId?: number;
  override data: IAddress[] = [];

  constructor(
    public routerLinkExt: RouterLinkExtension,
    public resizeExt: ResizeExtension,
    private service: AddressService,
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

    await this.loadingService.run(async () => {
      await this.reload();

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  override ngOnDestroy(): void {
      super.ngOnDestroy();
      if(this.modalMode) {
        this.popModalState();
      }
  }

  onClose() {
    this.getModalCtrl().dismiss();
  }

  onClick(item: IAddress) {
    if (this.modalMode) {
      this.getModalCtrl().dismiss(item);
    }
  }

  onChangeDefault(id: number) {
    if (this.defaultId == id)
      return;

    this.defaultId = id;
    this.cdRef.detectChanges();

    this.service.updateDefault(this.defaultId)
      .then(() => { })
      .catch(() => {
        this.getMessageExt().alert(this.lang(FAIL_MESSAGE));
      });
  }

  async onDetail(item?: IAddress) {
    const modal = await this.createModal({
      component: AddressDetailPage,
      cssClass: 'modal-t1',
      backdropDismiss: false,
      componentProps: {
        rawData: item
      }
    });

    modal.onWillDismiss().then(({ data }) => {
      if (data) {
        if (item?.id) {
          Utility.passByReference(item, data);
        }
        else {
          this.data.push(data);
        }
        this.cdRef.detectChanges();
      }
    });

    modal.present();
  }

  onRemove(item: IAddress, index: number) {
    this.getMessageExt().confirm({
      message: this.lang('您正在删除收货地址:N', { n: item.NameCn }),
      success: () => {
        this.loadingService.run(async () => {
          const res = await this.service.remove(item.id);
          if (res) {
            this.data.splice(index, 1);
            this.service.remove$.next(item);

            this.cdRef.detectChanges();
            this.getMessageExt().toast(res.msg!);
          }
        });
      }
    });
  }

  protected async reload(reset?: boolean) {
    if (reset)
      this.reset();

    const res = await this.service.getAll({ page: this.page, pageSize: this.pageSize });
    const data = res?.topics ?? [];

    this.defaultId = res?.extra?.defaultId;
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
        page: this.page == 1 ? null : this.page
      }, params)
    ));
  }

}
