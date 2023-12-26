import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'wzz-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOptionComponent {

  @Input() value!: string | number;

  constructor(private host: ElementRef) {

  }

  get text() {
    return this.host.nativeElement.innerText;
  }

  getData() {
    return { value: this.value, text: this.host.nativeElement.innerText };
  }

}
