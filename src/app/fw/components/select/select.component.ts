import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ContentChildren, QueryList, HostListener, forwardRef, AfterViewInit, ChangeDetectorRef, AfterContentChecked, AfterContentInit, ElementRef, Renderer2, ViewEncapsulation, Injector } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SelectOptionComponent } from '../select/select-option.component';
import { SelectModalPage } from './select-modal.page';
import { CompBase } from '../../bases/comp/comp.base';

interface IInterfaceOptions {
  header?: string;
  cssClass?: string;
}

@Component({
  selector: 'wzz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent extends CompBase implements ControlValueAccessor, AfterViewInit, AfterContentInit {

  @Input() value: any;
  @Input() placeholder!: string;
  @Input() interfaceOptions: IInterfaceOptions = {};
  @Input() cancelText = "Annulla";
  @Input() okText = "Seleziona";

  @Output() wzzChange = new EventEmitter<{ value: any, context: any }>();

  disabled = false;
  ref!: any;
  selectedItem: any;

  @ContentChildren(SelectOptionComponent) options!: QueryList<SelectOptionComponent>;

  constructor(
    protected modalCtrl: ModalController,
    protected renderer: Renderer2,
    protected override injector: Injector,
    protected host: ElementRef,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  ngAfterViewInit() {
    this.subscription.add(this.options.changes.subscribe(() => {
      this._init();
    }));
  }

  ngAfterContentInit() {
    this._init();
  }

  private _init() {
    this.ref = {};
    this.options.forEach(option => {
      this.ref[option.value] = option;
    });

    this.selectedItem = this.ref[this.value];
    this.cdRef.detectChanges();

  }

  @HostListener('click', ['$event'])
  async onClick() {
    this._click();
  }

  click(context?: any, value?: any) {
    if (value != undefined) {
      this.value = value;
      this.selectedItem = this.ref[this.value];
    }

    this._click(context);
  }

  private async _click(context?: any) {
    if (this.disabled)
      return;

    const modal = await this.modalCtrl.create({
      cssClass: this.interfaceOptions.cssClass ?? "wzz-select-modal",
      component: SelectModalPage,
      componentProps: {
        header: this.interfaceOptions.header,
        okText: this.okText,
        cancelText: this.cancelText,
        selectedItem: this.selectedItem,
        options: Array.from(this.options)
      }
    });

    modal.onWillDismiss().then(({ data }) => {
      this.onTouched();
      if (data) {
        this.selectedItem = data;
        this.value = data.value;
        this.onChange(this.value);
        this.wzzChange.next({ value: this.value, context: context });

        this.cdRef.detectChanges();
      }
    });

    await modal.present();
  }

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    if (this.ref && this.value != value) {
      this.selectedItem = this.ref[value];
      this.cdRef.detectChanges();
    }
    this.value = value;
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    if (disabled) {
      this.renderer.addClass(this.host.nativeElement, "select-disabled");
    }
    else {
      this.renderer.removeClass(this.host.nativeElement, "select-disabled");
    }
    // disable other components here
  }
}
