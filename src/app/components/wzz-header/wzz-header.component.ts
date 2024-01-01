import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { LangExtension } from '../../extensions/lang';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { ICategory, IDeliveryMethod, IPromo, IShop, IUser } from 'src/app/interfaces/i-data';
import { Env } from 'src/app/fw/dynamics/env';
import { COLLECTION_IDNO, MATETIAL_IDNO } from 'src/app/const/const';
import { CategoryService } from 'src/app/services/category.service';
import { filter } from 'rxjs';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { animate, style, transition, trigger } from '@angular/animations';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { SearchExtension } from 'src/app/extensions/search';

@Component({
  selector: 'wzz-header',
  templateUrl: './wzz-header.component.html',
  styleUrls: ['./wzz-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('searchInit', [
      transition(':enter', [])
    ]),
    trigger('searchInOut', [
      transition(':enter', [
        style({ "transform": "translate3d(20px, 0, 0)", "opacity": 0 }),
        animate('0.2s cubic-bezier(0.25, 0.8, 0.5, 1)', style({ transform: "translate3d(0, 0, 0)", "opacity": 1 })),
      ]),
      transition(':leave', [
        style({ transform: "translate3d(0, 0, 0)", "opacity": 1 }),
        animate('0.2s cubic-bezier(0.25, 0.8, 0.5, 1)', style({ "transform": "translate3d(20px, 0, 0)", "opacity": 0 })),
      ]),
    ])
  ]
})
export class WzzHeaderComponent extends CompBase implements AfterViewInit {

  @Input() inTab: boolean = false;
  @Input() topLevel: boolean = false;
  @Input() defaultHref?: string;
  @Input() q: string = "";

  timestamp = Date.now();

  events!: IPromo[];
  d?: IDeliveryMethod;
  collectionIdno = COLLECTION_IDNO;
  collectionCategories: ICategory[] = [];

  searchActive = false;

  materialIdno = MATETIAL_IDNO;
  materialCategories: ICategory[] = [];

  constructor(
    public resizeExt: ResizeExtension,
    public searchExt: SearchExtension,
    public routerLinkExt: RouterLinkExtension,
    public langExt: LangExtension,
    public dExt: DeliveryExtension,
    private _categoryService: CategoryService,
    protected router: Router,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    this.events = this.envExt.eventsHuodong;
    this.d = this.dExt.deliveryMethod;
    if (this.q) {
      this.searchActive = true;
    }

    this.cdRef.detectChanges();

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));

    this.subscription.add(this._categoryService.ready$.pipe(filter(data => !!data)).subscribe(() => {
      const ref = this._categoryService.getRef();
      this.collectionCategories = ref[COLLECTION_IDNO]?.Children ?? [];
      this.materialCategories = ref[MATETIAL_IDNO]?.Children ?? [];

      this.cdRef.detectChanges();
    }));
  }

  async onLogin() {
    this.eventsService.login$.next();
  }

  async onShowLanguageAS() {
    try {
      await this.langExt.showLanguageAS();
    } catch (e) { }
  }

  onShowAppMenu() {
    this.eventsService.showMenu$.next(this.topLevel);
  }

  async onSearch() {
    this.q = this.q.trim();
    if (!this.q) {
      this.getMessageExt().toast(this.lang("Inserisci la parola chiave"));
      return;
    }

    await this.router.navigateByUrl(this.routerLinkExt.normalize(
      this.routerLinkExt.getRouterLink([this.language, "searches"]),
      {
        q: this.q
      }
    ));

    this.searchExt.push(this.q);
  }
}
