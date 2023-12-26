import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { IBase } from '../../interfaces/i-data';
import { SelectOptionComponent } from './select-option.component';

@Component({
  selector: 'wzz-select-modal',
  templateUrl: './select-modal.page.html',
  styleUrls: ['./select-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SelectModalPage implements OnInit {

  @Input() header!: string;
  @Input() searchPlaceholder = "keywords..";
  @Input() okText!: string;
  @Input() cancelText!: string;

  @Input() selectedItem: any;
  @Input() options!: SelectOptionComponent[];

  itemHeight = 44;
  filteredOptions!: any[];

  @ViewChild(IonContent) content!: IonContent;

  constructor(
    private modalCtrl: ModalController,
    protected cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  async onSearch(q: string) {
    q = q.toLowerCase();
    this.filteredOptions = this.options.filter(option => {
      return option.value.toString().toLowerCase().indexOf(q) != -1 || option.text.toLowerCase().indexOf(q) != -1;
    });
    await this.content.scrollToTop(300);
    this.cdRef.detectChanges();
  }

  onSelect(item: any) {
    if (item == this.selectedItem)
      return;

    this.selectedItem = item;
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    this.modalCtrl.dismiss(this.selectedItem);
  }

  trackByFn(index: number, item: IBase) {
    if (!item)
      return null;
    return item.id;
  }
}
