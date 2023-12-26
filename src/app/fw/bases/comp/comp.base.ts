import { OnDestroy, ChangeDetectorRef, Directive, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { DOCUMENT, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { LangBase } from 'src/app/fw/bases/lang/lang.base';
import { ModalController, ModalOptions } from '@ionic/angular';
import { DEFAULT_IMAGE } from '../../const/const';
import { IBase } from '../../interfaces/i-data';
import { MessageExtension } from 'src/app/extensions/message';
import { EnvExtension } from 'src/app/extensions/env';
import { EventsService } from '../../dynamics/events.service';
import { LoadingService } from '../../services/loading.service';

@Directive()
export class CompBase extends LangBase implements OnDestroy {

  private _modalId?: number;
  private _domDocument?: Document;
  private _location?: Location;
  private _sanitizer?: DomSanitizer;
  private _modalCtrl?: ModalController;
  private _messageExt?: MessageExtension;

  envExt: EnvExtension;

  modalMode: boolean = false;
  mobile: boolean;
  defaultImage: string;

  protected myUrl: string = "";
  protected firstEnterView: boolean = true;
  visible: boolean = false;
  isLogin: boolean = false;

  protected subscription: Subscription = new Subscription();
  protected loadingService: LoadingService;
  protected eventsService: EventsService;

  constructor(
    protected override injector: Injector,
    public cdRef: ChangeDetectorRef
  ) {
    super(injector);

    this.envExt = injector.get(EnvExtension);
    this.loadingService = injector.get(LoadingService);
    this.eventsService = injector.get(EventsService);

    this.mobile = this.envExt.mobile;
    this.defaultImage = DEFAULT_IMAGE;
    this.isLogin = !!this.envExt.me;
  }

  async ionViewWillEnter() {
    this.firstEnterView = false;
  }

  async ionViewWillLeave() {
  }

  protected addLoginStateChangeSubscription(callback?: Function) {
    return this.eventsService.loginStateChange$
      .pipe(filter((isLogin: boolean | undefined) => isLogin != undefined && this.isLogin != isLogin))
      .subscribe(async (isLogin) => {
        this.isLogin = isLogin!;
        if (callback)
          callback();
      });
  }

  protected getDocument() {
    if (!this._domDocument)
      this._domDocument = this.injector.get(DOCUMENT);
    return this._domDocument;
  }

  protected getSanitizer() {
    if (!this._sanitizer)
      this._sanitizer = this.injector.get(DomSanitizer);
    return this._sanitizer;
  }

  protected getLocation(): Location {
    if (!this._location) {
      this._location = this.injector.get(Location);
    }
    return this._location;
  }

  protected getModalCtrl(): ModalController {
    if (!this._modalCtrl)
      this._modalCtrl = this.injector.get(ModalController);
    return this._modalCtrl;
  }

  protected getMessageExt() {
    if (!this._messageExt)
      this._messageExt = this.injector.get(MessageExtension);
    return this._messageExt;
  }

  protected async pushState() {
    this._modalId = Date.now();
    history.pushState({
      modal: this._modalId,
      desc: 'fake state for our modal'
    }, "");
  }

  protected popModalState() {
    if (history.state.modal == this._modalId) {
      this.envExt.historyPopTime = Date.now();
      history.back();
    }
  }

  async createModal(options: ModalOptions, directDismiss: boolean = true) {
    return this.getMessageExt().createModal(options, directDismiss);
  }

  trackByFn(index: number, item: IBase) {
    if (!item)
      return null;
    return item.id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}