import { IDeliveryMethod, IShop } from './../../interfaces/i-data';
import { CompBase } from './../../fw/bases/comp/comp.base';
import { ChangeDetectionStrategy, Component, Injector, ChangeDetectorRef, AfterViewInit, Input } from '@angular/core';
import { DeliveryExtension } from 'src/app/extensions/delivery';
import { SubscribeService } from 'src/app/services/subscribe.service';
import { CF_MSG, SUCCESS_MESSAGE } from 'src/app/fw/const/const';

@Component({
  selector: 'wzz-footer',
  templateUrl: './wzz-footer.component.html',
  styleUrls: ['./wzz-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzzFooterComponent extends CompBase implements AfterViewInit {

  @Input() inTab: boolean = false;
  shop!: IShop;
  d?: IDeliveryMethod;
  email!: string;

  constructor(
    public dExt: DeliveryExtension,
    private _subscribeService: SubscribeService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();
    this.shop = this.envExt.shop;
    this.d = this.dExt.deliveryMethod;
    this.visible = true;
    this.cdRef.detectChanges();
  }

  onSubscribe() {
    if (!this.email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
      this.getMessageExt().alert(this.lang("Email non valido"));
      return;
    }

    this._subscribeService.update(0, { Email: this.email }).catch(() => {
      this.getMessageExt().toast(this.lang(CF_MSG));
    });

    this.getMessageExt().toast(this.lang("Iscriti alla newsletter con successo"));
  }

}
