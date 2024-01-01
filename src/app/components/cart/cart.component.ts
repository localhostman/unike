import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input } from '@angular/core';
import { EnvExtension } from 'src/app/extensions/env';
import { DcompComponent, Animations } from 'src/app/fw/bases/dcomp/dcomp.component';
import { ICart } from 'src/app/interfaces/i-data';

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
export class CartComponent extends DcompComponent { 

  @Input() data!: ICart;

  constructor(
    public envExt: EnvExtension,
    protected override injector: Injector,
    protected override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

}
