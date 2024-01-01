import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Subject } from "rxjs";
import { MEDIA_WIDTH } from "../const/const";

@Injectable({
    providedIn: 'root'
})
export class ResizeExtension {

    private _tid: any;

    isXXXL: boolean = false;
    isXXL: boolean = false;
    isXL: boolean = false;
    isLG: boolean = false;
    isMD: boolean = false;
    isSM: boolean = false;

    resize$ = new Subject<number>();

    constructor(
        private _platform: Platform
    ) {
        let width = this._platform.width() ?? 8000;
        this._updateMode(width);
        this._platform.resize.subscribe(() => {
            width = this._platform.width();

            if (this._tid) {
                clearTimeout(this._tid);
            }

            this._tid = setTimeout(() => {
                clearTimeout(this._tid);
                this._tid = null;
                if (this._updateMode(width))
                    this.resize$.next(width);
            }, 200);


        });
    }

    private _updateMode(width: number) {
        let b = false;

        if (width > MEDIA_WIDTH.XXXL) {
            b = b || !this.isXXXL;
            this.isXXXL = true;
        }
        else {
            b = b || this.isXXXL;
            this.isXXXL = false;
        }

        if (width > MEDIA_WIDTH.XXL) {
            b = b || !this.isXXL;
            this.isXXL = true;
        }
        else {
            b = b || this.isXXL;
            this.isXXL = false;
        }

        if (width > MEDIA_WIDTH.XL) {
            b = b || !this.isXL;
            this.isXL = true;
        }
        else {
            b = b || this.isXL;
            this.isXL = false;
        }

        if (width > MEDIA_WIDTH.LG) {
            b = b || !this.isLG;
            this.isLG = true;
        }
        else {
            b = b || this.isLG;
            this.isLG = false;
        }

        if (width > MEDIA_WIDTH.MD) {
            b = b || !this.isMD;
            this.isMD = true;
        }
        else {
            b = b || this.isMD;
            this.isMD = false;
        }

        if (width > MEDIA_WIDTH.SM) {
            b = b || !this.isSM;
            this.isSM = true;
        }
        else {
            b = b || this.isSM;
            this.isSM = false;
        }

        return b;
    }
}