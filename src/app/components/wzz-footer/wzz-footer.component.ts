import { IShop } from './../../interfaces/i-data';
import { CompBase } from './../../fw/bases/comp/comp.base';
import { ChangeDetectionStrategy, Component, Injector, ChangeDetectorRef, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'wzz-footer',
  templateUrl: './wzz-footer.component.html',
  styleUrls: ['./wzz-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzzFooterComponent extends CompBase implements AfterViewInit {

  @Input() inTab: boolean = false;
  shop!: IShop;

  constructor(
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);

  }

  async ngAfterViewInit() {
    this.cdRef.detach();
    this.shop = this.envExt.shop;
    this.visible = true;
    this.cdRef.detectChanges();
  }

}
