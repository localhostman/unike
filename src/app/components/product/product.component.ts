import { RouterLinkExtension } from '../../fw/extensions/router-link';
import { ProductExtension } from 'src/app/extensions/product';
import { DeliveryExtension } from './../../extensions/delivery';
import { CompBase } from './../../fw/bases/comp/comp.base';
import { IProduct } from './../../interfaces/i-data';
import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef, Injector, AfterViewInit, OnChanges, SimpleChanges, HostListener, EventEmitter, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { GiftPropPage } from 'src/app/modals/gift-prop/gift-prop.page';
import { DEFAULT_IMAGE } from 'src/app/fw/const/const';

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
  @Input() giftReadonly: boolean = false;

  discount: number = 0;
  @Output() wzzUpdate = new EventEmitter<void>();

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

  onImageError(evt: any) {
    evt.target.src=DEFAULT_IMAGE;
  }

  @HostListener("click")
  async onClick() {
    if (this.asGift) {
      const modal = await this.getMessageExt().createModal({
        component: GiftPropPage,
        cssClass: "modal-product-prop",
        componentProps: {
          data: this.data,
          readonly: this.giftReadonly
        }
      });

      modal.onWillDismiss().then(() => {        
        this.cdRef.detectChanges();
        this.wzzUpdate.next();
      });

      await modal.present();
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

