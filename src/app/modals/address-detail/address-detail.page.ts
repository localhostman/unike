import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { ModalPage } from 'src/app/fw/bases/modal/modal.page';
import { AddressService } from 'src/app/services/address.service';
import { FormBuilder } from '@angular/forms';
import { IAddress } from 'src/app/interfaces/i-data';
import { IFieldRef } from 'src/app/fw/interfaces/i-data';
import { FORM_FIELD_TYPE } from 'src/app/fw/const/const';

@Component({
  selector: 'app-address-detail',
  templateUrl: '../../fw/bases/modal/form.page.html',
  styleUrls: ['../../fw/bases/modal/form.page.scss', './address-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressDetailPage extends ModalPage {

  fieldRef: IFieldRef = {
    idno: { required: false, readOnly: true, label: "Codice cliente", type: FORM_FIELD_TYPE.STRING, hidden: true },
    NameCn: { required: true, label: "Nominativo", type: FORM_FIELD_TYPE.STRING, helpText: "Inserisci il nominativo" },
    Phone: { required: true, label: "Telefono", type: FORM_FIELD_TYPE.STRING, helpText: "Inserisci il telefono" },
    Email: { required: true, label: "Email", type: FORM_FIELD_TYPE.STRING, helpText: "Inserisci il email" },
    City: { required: true, label: "Comune / Città", type: FORM_FIELD_TYPE.STRING, helpText: "Inserisci il Comune / Città" },
    Zip: { required: true, label: "Codice postale / CAP", type: FORM_FIELD_TYPE.STRING, helpText: "Inserisci il Codice postale / CAP" },
    Address: { required: true, label: "Indirizzo", type: FORM_FIELD_TYPE.STRING, helpText: "Inserisci l'indirizzo" },
    CNote: { required: false, label: "Nota", type: FORM_FIELD_TYPE.STRING, helpText: "Inserisci la nota" },
  };

  constructor(
    protected override service: AddressService,
    private fb: FormBuilder,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(service, injector, cdRef);

    this.form = this.fb.group({});
    this.fields = this.fieldRefToArray(this.fieldRef);
  }

  protected override async init() {
    this.title = this.data.id ? "Modifica indirizzo" : "Nuovo indirizzo";

    this.initFromData();

    this.form.get(`NameCn`)?.valueChanges.subscribe((val) => {
      if (!this.data.NameIt || this.data.NameIt == this.data.NameCn) {
        this.form.patchValue({ NameIt: val, NameCn: val }, { emitEvent: false });
      }
    });
  }

  protected override async runService(data: any, files: File[]) {
    return this.loadingService.run(async () => {
      const res = await this.service.update(this.data.id, data);
      if (res) {
        const topic: IAddress = res.topics;
        this.service.update$.next(topic);
      }

      return res;
    });
  }
}
