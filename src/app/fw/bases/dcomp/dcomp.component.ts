import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Directive, ComponentRef, Input, Output, Injector } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core';
import { firstValueFrom, Subject } from 'rxjs';
import { LangBase } from '../lang/lang.base';
import { CompBase } from '../comp/comp.base';

export const Animations = {
  backdropInOut: trigger('backdropInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms  cubic-bezier(0.25, 0.8, 0.5, 1)', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('300ms  cubic-bezier(0.25, 0.8, 0.5, 1)', style({ opacity: 0 })),
    ]),
  ]),
  hostFadeInOut: trigger('hostInOut', [
    transition(':enter', [
      style({ transform: 'translate3d(0, 100%, 1px)' }),
      animate('300ms  cubic-bezier(0.25, 0.8, 0.5, 1)', style({ transform: 'translate3d(0, 0, 1px)' })),
    ]),
    transition(':leave', [
      style({ transform: 'translate3d(0, 0, 1px)' }),
      animate('300ms  cubic-bezier(0.25, 0.8, 0.5, 1)', style({ transform: 'translate3d(0, 100%, 1px)' })),
    ]),
  ]),
  hostSlideInOut: trigger('hostInOut', [
    transition(':enter', [
      style({ transform: 'translate3d(100%, 0, 1px)' }),
      animate('300ms  cubic-bezier(0.25, 0.8, 0.5, 1)', style({ transform: 'translate3d(0, 0, 1px)' })),
    ]),
    transition(':leave', [
      style({ transform: 'translate3d(0, 0, 1px)' }),
      animate('300ms  cubic-bezier(0.25, 0.8, 0.5, 1)', style({ transform: 'translate3d(100%, 0, 1px)' })),
    ]),
  ]),
}

@Directive()
export class DcompComponent extends CompBase {

  @Input() compRef!: ComponentRef<DcompComponent>;
  @Input() pageCDRef!: ChangeDetectorRef;
  @Output() willDismiss$: Subject<OverlayEventDetail> = new Subject<OverlayEventDetail>();
  @Output() didDismiss$: Subject<OverlayEventDetail> = new Subject<OverlayEventDetail>();

  private _returnValue: OverlayEventDetail = { data: null };

  constructor(
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  async onWillDismiss() {
    return firstValueFrom(this.willDismiss$);
  }

  async onDidDismiss() {
    return firstValueFrom(this.didDismiss$);
  }

  async onAnimationStart(evt: AnimationEvent) {
    if (evt.toState == "void") {
      this.willDismiss$.next(this._returnValue);
      this.willDismiss$.complete();
    }
  }

  async onAnimationEnd(evt: AnimationEvent) {
    if (evt.toState == "void") {
      this.didDismiss$.next(this._returnValue);
      this.didDismiss$.complete();
      this.compRef.destroy();
    }
  }

  protected dismiss(data: any = null) {
    this._returnValue = { data };
    this.visible = false;
    this.cdRef.detectChanges();
  }

  async onClose() {
    this.dismiss();
  }

}