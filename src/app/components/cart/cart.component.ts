import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input } from '@angular/core';
import { DcompComponent, Animations } from 'src/app/fw/bases/dcomp/dcomp.component';
import { ICart } from 'src/app/interfaces/i-data';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    Animations.backdropInOut,
    Animations.hostSlideInOut
  ]
})
export class CartComponent extends DcompComponent implements AfterViewInit {

  @Input() data!: ICart;
  override visible: boolean = true;

  constructor(
    protected service: CartService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  ngAfterViewInit() {
    this.subscription.add(this.service.update$.subscribe(({ product }) => {
      if (product?.uniqueKey == this.data.uniqueKey) {
        this.data.Quantity = product.Quantity;
        this.data.Total = product.Total;
        this.cdRef.detectChanges();
      }
    }));
  }

}
