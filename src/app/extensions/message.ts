import { Injectable, Injector } from "@angular/core";
import { AlertController, ModalController, ModalOptions, ToastController } from "@ionic/angular";
import { LangBase } from "src/app/fw/bases/lang/lang.base";
import { Md5 } from "ts-md5";
import { EnvExtension } from "./env";

@Injectable({
    providedIn: 'root'
})
export class MessageExtension extends LangBase {

    constructor(
        private _envExt: EnvExtension,
        private _alertCtrl: AlertController,
        private _toastCtrl: ToastController,
        private _modalCtrl: ModalController,
        protected override injector: Injector
    ) {
        super(injector);
    }

    async alert(params: string | { message: string, header?: string, subHeader?: string, okText?: string }) {
        let tmp: { message: string, header?: string, subHeader?: string, okText: string };

        if (typeof params == "string") {
            tmp = { header: this.lang('Avviso'), okText: this.lang("OK"), message: params };
        }
        else {
            tmp = Object.assign({ header: this.lang('Avviso'), okText: this.lang("OK") }, params);
        }

        const alert = await this._alertCtrl.create({
            header: tmp.header,
            subHeader: tmp.subHeader,
            message: tmp.message,
            cssClass: 'wzz-alert',
            buttons: [tmp.okText]
        });
        await alert.present();
    }
    async confirm(params: { message: string, success: Function, header?: string, successText?: string, cancel?: Function, cancelText?: string, fail?: Function, failText?: string, onDismiss?: Function }) {
        const buttons: Array<any> = [];

        buttons.push({
            text: params.cancelText ? params.cancelText : this.lang("Annulla"),
            role: 'cancel',
            handler: () => {
                if (params.cancel)
                    params.cancel();
            }
        });

        if (params.fail && params.failText)
            buttons.push({
                text: this.lang(params.failText),
                handler: () => {
                    params.fail!();
                }
            });

        buttons.push({
            text: params.successText ? params.successText : this.lang("Conferma"),
            handler: () => {
                params.success();
            }
        });


        const confirm = await this._alertCtrl.create({
            header: params.header ? params.header : this.lang("Avviso"),
            message: this.lang(params.message),
            cssClass: 'wzz-alert',
            buttons: buttons
        });

        if (params.onDismiss)
            confirm.onDidDismiss().then(() => {
                params.onDismiss!();
            });
        await confirm.present();
    }

    async password(params: { message: string, success: Function, title?: string, successText?: string, cancel?: Function, cancelText?: string, enter?: Function }) {
        const prompt = await this._alertCtrl.create({
            header: params.title ? params.title : this.lang("Conferma eliminare"),
            message: this.lang(params.message),
            cssClass: 'wzz-alert',
            inputs: [{ type: "password", name: "password" }],
            buttons: [
                {
                    text: params.cancelText ? params.cancelText : this.lang("Annulla"),
                    role: 'cancel',
                    handler: (data: any) => {
                        if (params.cancel)
                            params.cancel(data);
                    }
                },
                {
                    text: params.successText ? params.successText : this.lang("Conferma"),
                    handler: ({ password }: any) => {
                        password = Md5.hashStr(password);
                        params.success(password);
                    }
                }
            ]
        });
        await prompt.present();

        const input = (prompt.querySelector(".alert-input") as HTMLInputElement);
        if (!input)
            return;

        input.focus();
        input.select();

        input.onkeydown = (evt) => {
            if (evt.key == "Enter") {
                if (params.enter) {
                    {
                        params.enter((evt.target as HTMLInputElement).value);
                        prompt.dismiss();
                    }
                }
                else if ((evt.target as HTMLElement).nodeName == "INPUT") {
                    (prompt.querySelector(".alert-button:last-child") as HTMLElement).click();
                    prompt.dismiss();
                }
            }
        };

        return prompt;
    }

    //input: {name?: string, type?: string, placeholder?: string, value: any}
    async prompt(params: { message: string, success: Function, inputs: Array<any>, title?: string, successText?: string, cancel?: Function, cancelText?: string, enter?: Function }) {
        const prompt = await this._alertCtrl.create({
            header: params.title ? params.title : this.lang("Avviso"),
            message: this.lang(params.message),
            cssClass: 'wzz-alert',
            inputs: params.inputs,
            buttons: [
                {
                    text: params.cancelText ? params.cancelText : this.lang("Annulla"),
                    role: 'cancel',
                    handler: (data: any) => {
                        if (params.cancel)
                            params.cancel(data);
                    }
                },
                {
                    text: params.successText ? params.successText : this.lang("Conferma"),
                    handler: (data: any) => {
                        params.success(data);
                    }
                }
            ]
        });
        await prompt.present();

        const input = (prompt.querySelector(".alert-input") as HTMLInputElement);
        if (!input)
            return;

        input.focus();
        input.select();

        input.onkeydown = (evt) => {
            if (evt.key == "Enter") {
                if (params.enter) {
                    {
                        params.enter((evt.target as HTMLInputElement).value);
                        prompt.dismiss();
                    }
                }
                else if ((evt.target as HTMLElement).nodeName == "INPUT") {
                    (prompt.querySelector(".alert-button:last-child") as HTMLElement).click();
                    prompt.dismiss();
                }
            }
        };

        return prompt;
    }

    async toast(params: { message: string, color?: string, duration?: number, position?: "bottom" | "middle" | "top" } | string) {
        let tmp: any = { message: '', color: 'dark', duration: 1000, position: 'middle' };

        if (typeof params == "string") {
            tmp.message = params;
        }
        else {
            tmp = Object.assign(tmp, params);
        }

        const toast = await this._toastCtrl.create({
            message: tmp.message,
            color: tmp.color,
            position: tmp.position,
            cssClass: 'toast-text-center',
            duration: tmp.duration
        });
        await toast.present();
    }

    async createModal(options: ModalOptions, directDismiss: boolean = true) {
        const modal = await this._modalCtrl.create(Object.assign({
            cssClass: "modal-t1",
            canDismiss: directDismiss ? true : async (data: any, role: string) => {
                if (role) {
                    return new Promise((resolve) => {
                        this.confirm({
                            message: this.lang("Stai chiudendo la pagina corrente"),
                            successText: this.lang("Conferma"),
                            cancelText: this.lang("Annulla"),
                            success: async () => {
                                resolve(true);
                            },
                            onDismiss: () => {
                                resolve(false);
                            }
                        });
                    });
                }
                return true;
            },
            initialBreakpoint: this._envExt.mobile ? 1 : undefined,
            backdropBreakpoint: 0,
            breakpoints: [0, 1],
            handle: false,
        }, options));

        await modal.present();

        return modal;
    }

}