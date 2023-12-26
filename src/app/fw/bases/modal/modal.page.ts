import { AfterViewInit, ChangeDetectorRef, Input, Directive, Injector } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Utility } from '../../../fw/utils/utility';
import { FORM_FIELD_TYPE, SUCCESS_MESSAGE } from 'src/app/fw/const/const';
import { IRes } from 'src/app/fw/interfaces/i-res';
import { BaseService } from '../../dynamics/base.service';
import { IFormField, IFormFieldBase } from '../../interfaces/i-data';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';

@Directive()
export class ModalPage extends CompBase implements AfterViewInit {

  @Input() rawData: any = {};
  @Input() title!: string;
  @Input() submitText: string = "Salva";

  data: any = {};
  protected langs: { [key: string]: any } = {};

  fieldTypes: typeof FORM_FIELD_TYPE = FORM_FIELD_TYPE;
  fields!: IFormField[];
  formHelpTextRef: { [key: string]: string } = {};

  protected showLoading: boolean = true;
  protected files: File[] = [];
  protected successMessage: string = SUCCESS_MESSAGE;

  form!: FormGroup;

  protected formInvalidMessage?: string;

  constructor(
    protected service: BaseService,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async ngAfterViewInit() {
    this.cdRef.detach();
    this.pushState();
    this.data = Object.assign(this.data, this.rawData);
    this.langs = this.data.langs ?? {};

    await this.loadingService.run(async () => {
      await this.init();
      this.visible = true;
      this.cdRef.detectChanges();
    }, false, this.showLoading, true);

    this.cdRef.reattach();
  }

  protected async init() {

  }

  hasChanges(data: any = null) {
    if (!data)
      data = this.getFormValue();
    return !Utility.isEqual(this.data, data) || this.files.length > 0;
  }

  protected fieldRefToArray(ref: { [key: string]: IFormFieldBase }) {
    return Object.keys(ref).map(key => {
      const field = ref[key] as IFormField;
      field.name = key;
      field.helpText = field.helpText ?? field.label;
      return field;
    });
  }

  protected initFromData(data?: any) {
    data = data ?? this.data;
    this.fields.forEach((field) => {
      const fieldname = field.name;
      if (fieldname) {
        const control = new UntypedFormControl({ value: data[fieldname] ?? "", disabled: field.readOnly });
        const validators: any[] = [];
        if (field.required)
          validators.push(Validators.required);
        if (field.maxLength)
          validators.push(Validators.maxLength(field.maxLength));

        control.setValidators(validators);
        this.form.addControl(fieldname, control);
      }
    });
  }

  protected checkValidate() {
    if (this.form.invalid) {
      let errorMessage: string = "";
      let control: AbstractControl | null;
      let field: IFormField | undefined;

      Object.keys(this.form.controls).forEach(key => {
        control = this.form.get(key);
        if (control) {
          if (control.invalid) {
            field = this.fields?.find(item => item.name == key);
            if (field) {
              errorMessage += field.helpText + "\n";
            }
          }
          control.markAsTouched();
        }
      });

      const formErrors = this.form.errors;
      if (formErrors)
        Object.keys(formErrors).forEach((key) => {
          const msg = this.formHelpTextRef[key] ?? null;
          if (msg)
            errorMessage += msg + "\n";
        });

      if (errorMessage) {
        this.getMessageExt().alert(this.lang(errorMessage));
      }

      return false;
    }
    return true;
  }

  protected getFormValue() {
    return this.form.getRawValue();
  }

  async onClose() {
    if (!this.form) {
      this.close();
      return;
    }

    let data = this.getFormValue();

    if (this.hasChanges(data)) {
      this.close(null, "changed");
    }
    else
      await this.close();
  }

  async close(data?: any, role?: string) {
    await this.getModalCtrl().dismiss(data, role);
  }

  protected async saveSuccessCallback(topics: any) {
    await this.getMessageExt().toast({ message: this.successMessage });
  }

  onChangeSort(evt: any, fieldname: string = "sort") {
    const b = evt.detail.checked;
    this.form.patchValue({ [fieldname]: b ? Math.round(Date.now() / 1000) : 0 }, { emitEvent: false });
  }

  async onSubmit() {
    let data = this.getFormValue();

    if (this.hasChanges(data)) {
      const res = await this.save(data);
      if (!!res) {
        const topics = res.topics;
        this.close(topics);
        await this.saveSuccessCallback(topics);
      }
    }
    else
      await this.close();
  }
  protected async save(data: any): Promise<IRes | null> {
    if (this.checkValidate()) {
      data.langs = this.langs;
      return await this.runService(data, this.files);
    }
    else {
      return null;
    }
  }

  protected async runService(data: any, files?: File[]): Promise<any> {
    throw 500;
  }
}
