import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input } from '@angular/core';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { IDeliveryMethod, IPromo } from 'src/app/interfaces/i-data';
import { LoginModalPage } from '../login-modal/login-modal.page';

@Component({
  selector: 'app-topad',
  templateUrl: './topad.page.html',
  styleUrls: ['./topad.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopadPage extends CompBase implements AfterViewInit {

  @Input() event!: IPromo;
  @Input() d!: IDeliveryMethod;
  giftThreshold: number = 0;

  constructor(
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  ngAfterViewInit() {
    this.cdRef.detach();
    
    this.giftThreshold = this.envExt.giftThreshold;
    this.cdRef.detectChanges();
  }

  onClose() {
    this.getModalCtrl().dismiss();
  }

  async onSubmit() {
    const modal = await this.createModal({
      component: LoginModalPage,
      cssClass: "modal-t1"
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data) {
        this.getModalCtrl().dismiss();
      }
    });

    await modal.present();
  }

}
