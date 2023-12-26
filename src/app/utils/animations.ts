// animations.ts
import { trigger, style, transition, animate } from '@angular/animations';

export const Animations = {
    accordionInit: trigger('accordionInit', [
        transition(':enter', [])
    ]),
    accordionOpenClose: trigger('accordionOpenClose', [
        transition(':enter', [
            style({ height: 0 }),
            animate('0.3s cubic-bezier(0.25, 0.8, 0.5, 1)', style({ height: "*" })),
        ]),
        transition(':leave', [
            style({ height: "*" }),
            animate('0.2s cubic-bezier(0.25, 0.8, 0.5, 1)', style({ height: 0 })),
        ]),
    ])
}