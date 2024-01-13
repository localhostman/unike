import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { ResizeExtension } from '../../fw/extensions/resize';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Injector } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductExtension } from 'src/app/extensions/product';
import { ICategory, ICommonEntity, IProduct, IProductProp } from 'src/app/interfaces/i-data';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { WzzStorage } from 'src/app/fw/utils/wzz-storage';
import { PRODUCT_SORT } from 'src/app/const/const';
import { skip, firstValueFrom, filter } from 'rxjs';
import { ProductPropService } from 'src/app/services/product-prop.service';
import { IRes } from 'src/app/fw/interfaces/i-res';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPage extends PageBase implements AfterViewInit {

  protected sortStorageKey: string = "product_sort";
  sorts: ICommonEntity[] = PRODUCT_SORT;
  sort!: ICommonEntity;

  filterMenuId = "product-filter-";
  contentId = "product-content-";

  categories!: ICategory[];
  override pageSize: number = 48;

  title!: string;
  promoId?: number;
  rootCategoryIdno!: string;
  categoryIdno!: string;
  q!: string;

  relativeCategoryRef: any = {};
  priceRange: any;
  minPrice!: number;
  maxPrice!: number;
  props!: IProductProp[];
  propIdnoRef: { [key: string]: boolean } = {};

  constructor(
    public dExt: DeliveryExtension,
    public routerLinkExt: RouterLinkExtension,
    public resizeExt: ResizeExtension,
    public productExt: ProductExtension,
    private productPropService: ProductPropService,
    private categoryService: CategoryService,
    private service: ProductService,
    private _menuCtrl: MenuController,
    private router: Router,
    private route: ActivatedRoute,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);

    const ts = Date.now();
    this.filterMenuId += ts;
    this.contentId += ts;
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    const snapshot = this.route.snapshot;
    const paramMap = snapshot.paramMap;
    const queryParamMap = snapshot.queryParamMap;

    this.q = queryParamMap.get("q") ?? "";
    const promoId = parseInt(paramMap.get("promoId") ?? "");
    this.rootCategoryIdno = paramMap.get("categoryIdno") ?? "";
    this.categoryIdno = queryParamMap.get("category") ?? "";
    this.page = parseInt(queryParamMap.get("page") ?? "1");

    await this.loadingService.run(async () => {
      const [categories, propRef, res1, sort] = await Promise.all([
        firstValueFrom(this.categoryService.ready$.pipe(filter(data => !!data))),
        this.productPropService.getData(),
        this.service.getRelativeFilter({ promoId: this.promoId, categoryIdno: this.rootCategoryIdno }),
        new Promise(async (r) => {
          const sortId = await WzzStorage.get(this.sortStorageKey);
          const sort = PRODUCT_SORT.find(item => item.id == sortId);
          if (!sort)
            r(PRODUCT_SORT[0]);
          r(sort);
        })
      ]);

      if (this.q) {
        this.promoId = undefined;
        this.title = "Risultati di ricerca";
      }
      else if (isNaN(promoId)) {
        this.promoId = undefined;
        const category = this.categoryService.find(this.rootCategoryIdno);
        if (category) {
          this.title = category.Name!;
        }
      }
      else {
        this.promoId = promoId;
        const event = this.envExt.eventsHuodong.find(event => event.id == this.promoId);
        if (event)
          this.title = event.Name;
      }

      if (!this.title) {
        this.title = this.lang("Prodotti");
      }

      const relativeFilter = res1?.topics ?? {};

      this.sort = sort as any;
      this.categories = categories!;

      this.props = [];
      Object.keys(propRef).forEach((key: string) => {
        const p1 = propRef[key];
        const categoryIds: string[] = p1.CategoryId;
        if (!!p1.Children?.length && (!this.rootCategoryIdno || !categoryIds.length || categoryIds.indexOf(this.rootCategoryIdno) != -1)) {
          this.props.push(p1);
        }
      });


      this.relativeCategoryRef = relativeFilter.CategoryIdnoRef ?? {};
      this.minPrice = relativeFilter.MinPrice ?? 0;
      this.maxPrice = relativeFilter.MaxPrice ?? 10;

      this.priceRange = {
        lower: this.minPrice,
        upper: this.maxPrice
      };

      await this.reload();

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));

    this.subscription.add(this.route.queryParams.pipe(skip(1)).subscribe(async (data) => {
      const q = data["q"] ?? "";
      const categoryIdno = data["category"] ?? "";
      const page = data["page"] ?? 1;

      if (categoryIdno == this.categoryIdno && page == this.page && q == this.q)
        return;

      this.q = q;
      this.categoryIdno = categoryIdno;
      this.page = page;

      await this.loadingService.run(async () => {
        await this.reload(true);
      });

      this.cdRef.detectChanges();
    }));
  }

  async onOpenMenu(menuId: string) {
    await this._menuCtrl.enable(true, menuId);
    await this._menuCtrl.open(menuId);
  }

  async onCloseMenu(menuId: string) {
    await this._menuCtrl.close(menuId);
  }

  async onSelectCategory(categoryIdno: string) {
    this.updateUrl({ category: categoryIdno });
  }

  async onSort() {
    await this.loadingService.run(async () => {
      await this.reload(true);
    });

    this.cdRef.detectChanges();
  }

  async onClickProp(propIdno: string) {
    if (this.propIdnoRef[propIdno])
      delete this.propIdnoRef[propIdno];
    else
      this.propIdnoRef[propIdno] = true;

    this.cdRef.detectChanges();

    await this.loadingService.run(async () => {
      await this.reload(true);
    });

    this.cdRef.detectChanges();
  }

  async onChangePriceRange(evt: any) {
    this.cdRef.detectChanges();

    await this.loadingService.run(async () => {
      await this.reload(true);
    });

    this.cdRef.detectChanges();
  }

  protected async reload(reset?: boolean) {
    if (reset)
      this.reset();

    let res: IRes | undefined;
    if (this.q) {
      res = await this.service.search({
        q: this.q,
        sort: this.sort.id
      }, { page: this.page, pageSize: this.pageSize });
    }
    else {
      res = await this.service.getAll({
        categoryId: this.categoryIdno,
        promoId: this.promoId,
        propIdnos: Object.keys(this.propIdnoRef),
        minPrice: this.priceRange.lower,
        maxPrice: this.priceRange.upper,
        sort: this.sort.id
      }, { page: this.page, pageSize: this.pageSize });
    }


    const data: IProduct[] = res?.topics ?? [];
    this.count = res?.totalCount ?? 0;
    this.data = this.data.concat(data);

    this.productExt.normalize(data, this.dExt.deliveryMethod, this.ref);
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
        q: this.q,
        category: this.categoryIdno,
        page: this.page == 1 ? null : this.page
      }, params)
    ));
  }

  pricePinFormatter(value: number) {
    return `€${value.toFixed(2)}`;
  }

}
