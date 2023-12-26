import { Injectable } from '@angular/core';
import { IPromo } from '../interfaces/i-data';

@Injectable({
    providedIn: 'root'
})
export class PromoExtension {
    usables: IPromo[] = [];

    autoGets!: IPromo[];
    extras!: IPromo[];

    constructor() {

    }

    async inizialize(autoGets: IPromo[], usables: IPromo[], moa: number) {
        this.autoGets = autoGets.filter((item: IPromo) => item.Moa! <= moa);
        this.usables = usables.filter((item: IPromo) => item.Moa! <= moa);
        this.extras = [];
    }

    get useds() {
        return this.autoGets.concat(this.extras);
    }

    get ids() {
        return this.useds.map(item => item.id);
    }

    getSum(percentDiscount: number = 0, discount: number = 0) {
        this.useds.forEach((item) => {
            const bonus = item.Bonus!;
            if (bonus < 1) {
                percentDiscount += bonus;
            }
            else {
                discount += bonus;
            }
        });

        return [percentDiscount, discount];
    }

}