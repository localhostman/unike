import { Pipe, PipeTransform } from '@angular/core';
import { DELIVERY_METHOD } from '../const/const';
import { IDeliveryMethod, IProduct } from '../interfaces/i-data';

@Pipe({
  name: 'productSupportDelivery'
})
export class ProductSupportDeliveryPipe implements PipeTransform {

  transform(product: IProduct, d: IDeliveryMethod): boolean {
    return (d.TypeId != DELIVERY_METHOD.POST || !!product.Mailable) &&
      (!d.SupportedCategories || d.SupportedCategories.some(function (item) {
        return product.CategoryId!.indexOf(item) == 0 || product.CategoryId2!.indexOf(item) == 0
      }));
  }

} 
