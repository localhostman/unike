import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DEFAULT_IMAGE } from 'src/app/fw/const/const';
import { Utility } from 'src/app/fw/utils/utility';

@Component({
  selector: 'zoom-image',
  templateUrl: './zoom-image.component.html',
  styleUrls: ['./zoom-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZoomImageComponent implements OnChanges, OnInit {

  @Input() image!: string;

  @ViewChild("el") el!: ElementRef;
  private _zoomImageOffsetTop!: number;
  private _zoomImageOffsetLeft!: number;

  zoom: number = 2;
  x!: number;
  y!: number;
  zIndex: number = -1;
  zooming: boolean = false;
  defaultImage: string = DEFAULT_IMAGE;
  visible: boolean = false;

  constructor(
    public cdRef: ChangeDetectorRef
  ) {
      cdRef.detach();
  } 

  ngOnChanges(changes: SimpleChanges) {
    const change = changes["image"];
    if (change && this.image) {
      this.visible = true;
      this.cdRef.detectChanges();
    }
  }

  ngOnInit() {
  }

  // private _tid1: any;
  // onClickImageZoom(evt: any) {
  //   if (this._tid1)
  //     clearTimeout(this._tid1);

  //   this.zooming = true;
  //   this.cdRef.detectChanges();
  //   this.zoom++;
  //   this.onMouseMoveImage(evt);

  //   this._tid1 = setTimeout(() => {
  //     clearTimeout(this._tid1);
  //     this.zooming = false;
  //     this.cdRef.detectChanges();
  //   }, 200);
  //   this.cdRef.detectChanges();
  // }

  onMouseEnter() {
    const el = this.el.nativeElement;
    this._zoomImageOffsetLeft = Utility.getOffsetLeft(el);
    this._zoomImageOffsetTop = Utility.getOffsetTop(el);
    this.cdRef.detectChanges();
  }

  onMouseMove(evt: any) {
    this.zIndex = 2;
    this.x = (evt.clientX - this._zoomImageOffsetLeft) * (this.zoom - 1);
    this.y = (evt.clientY - this._zoomImageOffsetTop) * (this.zoom - 1);
    this.cdRef.detectChanges();
  }

  onMouseLeave() {
    this.zIndex = -1;
    this.zoom = 2.5;
    this.cdRef.detectChanges();
  }

}
