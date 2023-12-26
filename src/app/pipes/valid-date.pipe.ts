import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validDate'
})
export class ValidDatePipe implements PipeTransform {

  transform(value: string): string {
    const arr = value.split("-");
    return arr[1] + "." + arr[2];
  }

}
