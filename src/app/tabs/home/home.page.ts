import { MATETIAL_IDNO } from './../../const/const';
import { RouterLinkExtension } from '../../fw/extensions/router-link';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { ProductExtension } from './../../extensions/product';
import { Component, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Injector, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { IShop, IAd, IProduct, ICategory } from 'src/app/interfaces/i-data';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { HomeService } from 'src/app/services/home.service';
import { Swiper } from 'swiper/types';
import { CategoryService } from 'src/app/services/category.service';
import { COLLECTION_IDNO, INS_MEDIA_TYPE } from 'src/app/const/const';
import { InsService } from 'src/app/services/ins.service';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { filter, firstValueFrom } from 'rxjs';
import { MEDIA_WIDTH } from 'src/app/fw/const/const';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage extends CompBase implements AfterViewInit {

  insMediaTypes = INS_MEDIA_TYPE;
  collectionIdno = COLLECTION_IDNO;
  pSwiperBreakpoints = {
    0: {
      slidesPerView: 2,
      spaceBetween: 12,
      grid: { fill: "row", rows: 2 }
    },
    [MEDIA_WIDTH.LG]: {
      slidesPerView: 4,
      spaceBetween: 12,
      grid: { fill: "row", rows: 2 }
    },
    [MEDIA_WIDTH.XXL]: {
      slidesPerView: 4,
      spaceBetween: 20,
      grid: { fill: "row", rows: 1 }
    }
  };

  shop!: IShop;
  events!: any[];
  banners!: IAd[];
  collectionCategories!: ICategory[];

  materialIdno = MATETIAL_IDNO;
  materialProducts!: IProduct[];
  promoProductRef: { [key: string]: IProduct[] } = {};

  insMedias: any[] = [
    null, null, null, null,
    null, null, null, null
  ];
  insMediaCursorAfter!: string;
  insMediaInloading: boolean = true;

  private _b1SwiperEl!: Swiper;
  @ViewChild("b1SwiperRef") b1SwiperRef!: ElementRef;

  p1SwiperEls: Swiper[] = [];
  @ViewChildren("p1SwiperRef") p1SwiperRefs!: QueryList<ElementRef>;

  v1VideoEl?: HTMLVideoElement;
  @ViewChild("v1VideoRef") v1VideoRef?: ElementRef;

  constructor(
    public dExt: DeliveryExtension,
    public routerLinkExt: RouterLinkExtension,
    public productExt: ProductExtension,
    public resizeExt: ResizeExtension,
    protected categoryService: CategoryService,
    protected insService: InsService,
    protected homeService: HomeService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    this.shop = this.envExt.shop;
    this.events = this.envExt.eventsHuodong;

    await this.loadingService.run(async () => {
      const [categories,] = await Promise.all([
        firstValueFrom(this.categoryService.ready$.pipe(filter(data => !!data))),
        this._reload()
      ]);

      categories?.forEach((category: ICategory) => {
        if (category.idno === COLLECTION_IDNO)
          this.collectionCategories = category.Children ?? [];
      });

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this._b1SwiperEl = this.b1SwiperRef?.nativeElement?.swiper;
    this._b1SwiperEl?.autoplay?.start();

    this.p1SwiperEls = this.p1SwiperRefs.map(item => item.nativeElement.swiper);

    this.v1VideoEl = this.v1VideoRef?.nativeElement;

    this.cdRef.detectChanges();

    this.insService.getAll().then((res) => {
      this.insMedias = res?.topics ?? [];
      this.insMediaCursorAfter = res?.extra;
      this.insMediaInloading = false;
      this.cdRef.detectChanges();
    });

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));

    this.subscription.add(this.addLoginStateChangeSubscription(() => {
      this.loadingService.run(async () => {
        await this._reload();
        this.cdRef.detectChanges();
      });
    }));
  }

  async onLoadInsMedias() {
    if (this.insMediaInloading)
      return;

    this.cdRef.detach();

    this.insMediaInloading = true;
    this.cdRef.detectChanges();

    const res = await this.insService.getAll({ after: this.insMediaCursorAfter });
    this.insMedias = this.insMedias.concat(res?.topics ?? []);
    this.insMediaCursorAfter = res?.extra;
    this.insMediaInloading = false;
    this.cdRef.detectChanges();
    this.cdRef.reattach();
  }

  private async _reload() {
    const res = await this.homeService.getAll({ promoIds: this.events.map(item => item.id) });
    const { Banners, MaterialProducts, PromoProductRef } = res?.topics ?? {};

    this.banners = Banners ?? [];
    this.materialProducts = MaterialProducts ?? [];
    this.promoProductRef = PromoProductRef ?? {};

    const d = this.dExt.deliveryMethod;
  }

  onCallPhone() {
    window.location.href = `tel: ${this.shop.Phone}`;
  }

  //@override
  protected updateUrl() {
    this.getLocation().replaceState(this.routerLinkExt.normalize(
      this.routerLinkExt.getRouterLink([this.language, "home"]) as string
    ));
  }
}
