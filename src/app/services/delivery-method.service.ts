import { AjaxService } from 'src/app/fw/services/ajax.service';
import { Inject, Injectable, Injector } from '@angular/core';
import { BaseService } from '../fw/dynamics/base.service';
import { WzzStorage } from '../fw/utils/wzz-storage';
import { IDeliveryMethod } from '../interfaces/i-data';

const STORAGE_KEY = "selected_delivery_method_id";

@Injectable({
  providedIn: 'root'
})
export class DeliveryMethodService extends BaseService {
  private _selectedId?: number;

  constructor(
    @Inject("apiUrl") protected override apiUrl: string,
    protected override ajaxService: AjaxService,
    protected override injector: Injector
  ) {
    super(apiUrl, ajaxService, injector);

  }

  async getSelectedId() {
    if (!!this._selectedId)
      return this._selectedId;

    if (!this.data || this.data.length == 0)
      return -1;

    let selectedId: number = await WzzStorage.get(STORAGE_KEY);
    let selectedIndex = this.data.findIndex((item: IDeliveryMethod) => item.id == selectedId);
    if (selectedIndex == -1)
      selectedId = this.data[0].id;

    this.setSelectedId(selectedId);

    return selectedId;
  };

  async getSelectedItem(id?: number) {
    id = id || await this.getSelectedId();
    return this.data.find((item: IDeliveryMethod) => item.id == id);
  };

  async setSelectedId(val: number) {
    this._selectedId = val;
    WzzStorage.set(STORAGE_KEY, val);
    return await this.getSelectedItem(val);
  };
}