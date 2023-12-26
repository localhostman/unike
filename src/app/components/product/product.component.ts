import { RouterLinkExtension } from './../../extensions/router-link';
import { ProductExtension } from 'src/app/extensions/product';
import { DeliveryExtension } from './../../extensions/delivery';
import { CompBase } from './../../fw/bases/comp/comp.base';
import { IProduct } from './../../interfaces/i-data';
import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, Injector, AfterViewInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ResizeExtension } from 'src/app/extensions/resize';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent extends CompBase implements OnChanges, AfterViewInit {

  @Input() data!: IProduct;
  @Input() ltime!: number;
  @Input() asGift: boolean = false;

  discount: number = 0;

  constructor(
    public dExt: DeliveryExtension,
    public routerLinkExt: RouterLinkExtension,
    public productExt: ProductExtension,
    public resizeExt: ResizeExtension,
    protected navCtrl: NavController,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
    this.cdRef.detach();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cdRef.detectChanges();
  }

  async ngAfterViewInit() {
    this.discount = this.data.Discount!;
    this.cdRef.detectChanges();
  }

  @HostListener("click")
  onClick() {
    if (this.asGift) {

    }
    else {
      this.navCtrl.navigateForward(this.routerLinkExt.translate([this.language, "product-detail", this.data.id, this.data.idno]), { animated: !this.resizeExt.isLG });
    }
  }

  // async onChangeQuantity(qt: number) {
  //   await this.productExt.toCart(this.data, qt, this.data.Stock); 
  //   await this.dExt.update();
  // }

}

