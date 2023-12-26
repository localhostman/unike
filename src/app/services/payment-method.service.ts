import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { IPaymentMethod } from '../interfaces/i-data';
import { WzzStorage } from '../fw/utils/wzz-storage';
import { PAYMENT_METHOD } from '../const/const';

const STORAGE_KEY = "selected_payment_method_id";

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService extends BaseService {
  private _strict!: string;
  private _localData?: IPaymentMethod[];
  private _selectedItem?: IPaymentMethod;

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);
    this.controllerName = "payment_method";
  }

  setStrict(val: string) {
    if (this._strict != val) {
      this._strict = val;
      this._localData = undefined;
      this._selectedItem = undefined;
    }
  }

  override async getData() {
    if (!this._localData) {
      const isWechat = this.envExt.wechat;
      this._localData = this.data.filter(
        (item: IPaymentMethod) =>
          (!this._strict || this._strict.indexOf(item.id + "") != -1) &&
          ((isWechat && [PAYMENT_METHOD.CASH_ON_DELIVERY, PAYMENT_METHOD.MONEY_TRANSFER, PAYMENT_METHOD.WX_PAY].indexOf(item.id!) != -1) || !isWechat));
    }

    return this._localData;
  }

  async getSelectedItem() {
    if (!this._selectedItem) {
      const selectedId: number = await WzzStorage.get(STORAGE_KEY);
      let selectedItem: IPaymentMethod | undefined;

      const data: IPaymentMethod[] = (await this.getData())!;

      selectedItem = data.find(item => item.id == selectedId);
      if (!selectedItem)
        selectedItem = data[0];

      this.setSelectedItem(selectedItem);
    }

    return this._selectedItem;
  };

  async setSelectedItem(item: IPaymentMethod) {
    this._selectedItem = item;
    WzzStorage.set(STORAGE_KEY, item.id);
    return item;
  };
}
