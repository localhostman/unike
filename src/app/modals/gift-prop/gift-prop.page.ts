import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, Input, ViewChild } from '@angular/core';
import { ProductPropPage } from '../product-prop/product-prop.page';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { ProductExtension } from 'src/app/extensions/product';
import { ProductPropService } from 'src/app/services/product-prop.service';
import { Product } from 'src/app/utils/product';
import Swiper from 'swiper';
import { GiftService } from 'src/app/services/gift.service';

@Component({
  selector: 'app-gift-prop',
  templateUrl: './gift-prop.page.html',
  styleUrls: ['./gift-prop.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftPropPage extends ProductPropPage implements AfterViewInit {

  @Input() readonly: boolean = false;

  thumbImgPaths: string[] = [];
  origImgPaths: string[] = [];
  selectedImageIndex: number = 0;

  @ViewChild("i1SwiperRef") i1SwiperRef!: ElementRef;

  constructor(
    public override dExt: DeliveryExtension,
    public override productExt: ProductExtension,
    public giftService: GiftService,
    protected override service: ProductPropService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(dExt, productExt, giftService, service, injector, cdRef);
  }

  override async ngAfterViewInit() {
    [this.thumbImgPaths, this.origImgPaths] = Product.getImgPaths(this.data);
    await super.ngAfterViewInit();
  }

  get i1SwiperEl(): Swiper | undefined {
    return this.i1SwiperRef?.nativeElement?.swiper;
  }

  override onChangeProp({ lastCart, imgPath = null }: any) {
    let foundIndex = 0;
    if (!!imgPath) {
      foundIndex = this.origImgPaths.findIndex(item => item == imgPath);
      if (foundIndex == -1)
        foundIndex = 0;
    }

    this.lastCart = lastCart;

    this.cdRef.detectChanges();

    const tid = setTimeout(() => {
      clearTimeout(tid);

      this.i1SwiperEl?.slideTo(foundIndex, this.selectedImageIndex === undefined ? 0 : 300);

      this.selectedImageIndex = foundIndex;
      this.cdRef.detectChanges();
    }, 100);

  }

  onChangeImage(index: number) {
    this.selectedImageIndex = index;
    this.cdRef.detectChanges();
  }

  override onChangeQuantity(qt: number) {
    this.productPropEl.changeQuantity(qt);
  }

}
