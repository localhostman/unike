import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Injector, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { ICategory, IPromo } from 'src/app/interfaces/i-data';
import { COLLECTION_IDNO, MATETIAL_IDNO } from 'src/app/const/const';
import { CategoryService } from 'src/app/services/category.service';
import { filter } from 'rxjs';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { Animations } from 'src/app/utils/animations';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';

@Component({
  selector: 'wzz-menu',
  templateUrl: './wzz-menu.component.html',
  styleUrls: ['./wzz-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    Animations.accordionOpenClose
  ]
})
export class WzzMenuComponent extends CompBase implements AfterViewInit {

  topLevel: boolean = false;
  events!: IPromo[];
  categoryStateRef: any = {};

  collectionIdno = COLLECTION_IDNO;
  collectionCategories: ICategory[] = [];

  materialIdno = MATETIAL_IDNO;
  materialCategories: ICategory[] = [];

  @Output() change = new EventEmitter<void>();

  constructor(
    public resizeExt: ResizeExtension,
    public rExt: RouterLinkExtension,
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

  onClickItem() {
    this.change.next();
  }

}
