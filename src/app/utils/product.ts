import { IBase } from '../fw/interfaces/i-data';
import { IProduct, IDeliveryMethod, ICart } from './../interfaces/i-data';

export class Product {
    static isValuableMoa(product: IProduct, d: IDeliveryMethod) {
        const cs = d.AcceptedCategories;
        return !!product.ValuableMoa && (!cs || cs.some(function (c) {
            return product.CategoryId!.indexOf(c) == 0 || product.CategoryId2!.indexOf(c) == 0
        }));
    }

    static getKey(item: any) {
        return item.idno + "_" + (item.PropIdno ?? "");
    }

    static generateTotal(item: ICart) {
        item.Total = item.Quantity! * item.Price! * (1 - item.Discount!);
    };

    static reachMaxOrderProduct(maxOrderProductCount: number, data: IBase[]) {
        return !!maxOrderProductCount && data.length >= maxOrderProductCount;
    };

    static reachMaxNumPerOrder(product: IProduct, qt: number, maxNumPerOrder: number) {
        if (!maxNumPerOrder)
            return 999999;

        if (maxNumPerOrder < qt)
            return true;
        else
            return maxNumPerOrder;
    };

    static reachStock(product: IProduct, qt: number, propStock?: number, totalStock?: number) {
        if (!product.EnableStock)
            return 999999;

        if (propStock == undefined) {
            propStock = totalStock;
        }

        if (propStock! < qt)
            return true;
        else
            return propStock ?? 0;
    };

    static getImgPaths(data: IProduct) {
        const imageCount: number = data.ImageCount!;
        const imgPath: string = data.ImgPath!;
        let thumbImgPaths: string[] = [];
        let origImgPaths: string[] = [];
        const [prefixThumb, sufix] = imgPath.split(".jpg?");
        const prefixOrig = prefixThumb.replace("/md_products/", "/original_products/");

        for (let i: number = 0; i < imageCount; i++) {
            const ext = (i == 0 ? `.jpg` : `_${i}.jpg`) + `?${sufix}`;
            thumbImgPaths.push(prefixThumb + ext);
            origImgPaths.push(prefixOrig + ext);
        }

        return [thumbImgPaths, origImgPaths];
    }

}