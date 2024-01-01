import { ChangeDetectorRef, Injectable, Type, ViewContainerRef } from "@angular/core";

interface IComponent {
    compRef: any;
    pageCDRef: ChangeDetectorRef;
    onWillDismiss: Function;
    onDidDismiss: Function;
    [key: string]: any;
}

interface IComponentProp {
    component: Type<IComponent>;
    componentProps?: any;
    templ: ViewContainerRef;
    cdRef: ChangeDetectorRef;
}

@Injectable({
    providedIn: 'root'
})
export class DCompExtension {
    constructor(
    ) {
    }

    create({ component, componentProps, templ, cdRef }: IComponentProp): IComponent {
        const componentRef = templ.createComponent(component);
        let instance: IComponent = componentRef.instance;

        instance.compRef = componentRef;
        instance.pageCDRef = cdRef;
        instance = Object.assign(instance, componentProps);
        cdRef.detectChanges();

        return instance;
    }
}