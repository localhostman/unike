import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResizeExtension } from 'src/app/extensions/resize';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';
import { PageBase } from 'src/app/fw/bases/page/page.base';
import { FORM_INVALID_MSG, SUCCESS_MESSAGE } from 'src/app/fw/const/const';
import { IUser } from 'src/app/interfaces/i-data';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage extends PageBase implements OnInit, AfterViewInit {

  tabMode: boolean = false;
  me?: IUser;
  form: FormGroup;

  constructor(
    public resizeExt: ResizeExtension,
    protected service: CompanyService,
    private fb: FormBuilder,
    protected router: Router,
    protected route: ActivatedRoute,
    private _renderer: Renderer2,
    private _hostEl: ElementRef,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);

    this.form = this.fb.group({
      "id": [null],
      "FirstName": [null, Validators.required],
      "LastName": [null, Validators.required],
      "Email": [null],
      "Birthday": [null],
      "Phone": [null],
    });
  }

  ngOnInit() {
    this.tabMode = !!this.route.snapshot.data["tabMode"];
  }

  async ngAfterViewInit() {
    this.cdRef.detach();

    if (this.tabMode)
      this._renderer.addClass(this._hostEl.nativeElement, "tab");

    await this.loadingService.run(async () => {
      this.me = this.envExt.me;

      await this._reload();

      this.visible = true;
      this.cdRef.detectChanges();
    }, false);

    this.subscription.add(this.resizeExt.resize$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.getMessageExt().alert(this.lang(FORM_INVALID_MSG));
      return;
    }

    const data = this.form.getRawValue();
    await this.loadingService.run(async () => {
      if (await this.service.update(null, data)) {
        await this.getMessageExt().toast(this.lang(SUCCESS_MESSAGE));
      }
    });
  }

  private async _reload() {
    const res = await this.service.getOne(0);
    const topic = res?.topics ?? {};
    if (!topic.Email)
      topic.Email = this.me?.Email;

    this.form.patchValue(topic);
  }

  protected async paging(reset: boolean = false) {
  }

}
