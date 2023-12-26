import { EnvExtension } from 'src/app/extensions/env';
import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'weight'
})
export class WeightPipe extends DecimalPipe implements PipeTransform {

  constructor(private _envExt: EnvExtension) {
    super("it");
  }

  override transform(value: any): any {
    return `${super.transform(value)}${this._envExt.weightUM}`;
  }

}
