import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxNum'
})
export class MaxNumPipe implements PipeTransform {

  transform(value: number, maxNum: number = 999): string {
    if (value > maxNum)
      return maxNum + '+ ';
    return value + '';
  }

}
