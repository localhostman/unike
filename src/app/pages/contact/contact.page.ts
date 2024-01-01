import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResizeExtension } from 'src/app/fw/extensions/resize';
import { RouterLinkExtension } from 'src/app/fw/extensions/router-link';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { MeService } from 'src/app/services/me.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPage extends PageBase implements AfterViewInit {

  form: FormGroup;

  constructor(
    public routerLinkExt: RouterLinkExtension,
    public resizeExt: ResizeExtension,
    protected service: MeService,
    private _fb: FormBuilder,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);

    this.form = this._fb.group({
      "Name": [null, Validators.required],
      "Email": [null, Validators.required],
      "Message": [null, Validators.required],
    });
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    this.visible = true;
    this.cdRef.detectChanges();

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.getMessageExt().alert(this.lang("Compilare tutti i campi"));
      return;
    }

    await this.loadingService.run(async () => {
      if (await this.service.contact(this.form.getRawValue())) {
        this.form.reset();
        await this.getMessageExt().alert(this.lang("Messaggio inviato, si prega di attendere pazientemente la risposta del servizio clienti"));
      }
    });
  }

  protected async paging(reset: boolean = false) {
  }

}
