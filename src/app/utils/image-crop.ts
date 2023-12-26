import * as EXIF from "exif-js/exif";

const testAutoOrientationImageURL: string =
  'data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAA' +
  'AAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
  'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
  'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/x' +
  'ABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAA' +
  'AAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==';

export const IMAGE_TYPE = {
  JPEG: "jpeg",
  PNG: "png",
}

export const FIT_MODE = {
  COVER: 1,
  CONTAIN: 2
}

export class ImageCrop {

  private static instance: ImageCrop;
  private imageType: string;
  private fitMode: number;
  private fullSize: boolean = false;
  private isImageAutomaticRotation?: boolean;
  public canvas!: HTMLCanvasElement;

  constructor(imageType: string, fitMode: number, fullSize: boolean) {
    this.imageType = imageType;
    this.fitMode = fitMode;
    this.fullSize = fullSize;
  }
  static getCrop(file: File, width: number = 500, height: number = 500, imageType: string = "jpeg", fitMode: number = FIT_MODE.COVER, fullSize: boolean = false): Promise<File> {
    if (!ImageCrop.instance) {
      ImageCrop.instance = new ImageCrop(imageType, fitMode, fullSize);
      ImageCrop.instance.canvas = document.createElement('canvas');
    }

    return ImageCrop.instance.crop(file, width, height);
  }
  crop(file: File, width: number, height: number): Promise<File> {
    let reader: FileReader = new FileReader();
    return new Promise<File>((resolve) => {
      reader.onload = () => {
        // 通过 reader.result 来访问生成的 DataURL
        let url = reader.result;
        let image: HTMLImageElement = new Image();
        image.onload = async () => {
          let orientation: any;
          if (await this.detectImageAutomaticRotation()) {
          }
          else {
            orientation = await ImageCrop.getImageOrientation(image as any);
          }
          let base64: string = await this.getBase64(image, width, height, orientation);
          resolve(this.getBlob(file.name, base64));
        };

        image.src = <any>url;

      };

      reader.readAsDataURL(file);
    });

  }
  private getInfo(imageWidth: number, imageHeight: number, targetWidth: number, targetHeight: number, fitMode: number) {
    let x: number;
    let y: number;

    let porpWidth: number = targetWidth / imageWidth;
    let porpHeight: number = targetHeight / imageHeight;

    if ((fitMode == FIT_MODE.COVER && porpWidth < porpHeight) || (fitMode == FIT_MODE.CONTAIN && porpWidth >= porpHeight)) {
      imageWidth = imageWidth * porpHeight;
      imageHeight = targetHeight;
      x = -(imageWidth - targetWidth) / 2;
      y = 0;
    }
    else {
      imageWidth = targetWidth;
      imageHeight = imageHeight * porpWidth;
      x = 0;
      y = -(imageHeight - targetHeight) / 2;
    }

    if (this.fullSize) {
      targetWidth = imageWidth;
      targetHeight = imageHeight;
      x = 0;
      y = 0;
    }

    return [x, y, imageWidth, imageHeight, targetWidth, targetHeight];
  }

  private toCanvas(image: HTMLImageElement, x: number, y: number, imgWidth: number, imgHeight: number, width: number, height: number, angle: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    let ctx: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, width, height);

    if (angle == 0) {
      ctx.drawImage(image, x, y, imgWidth, imgHeight);
    }
    else {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(angle * Math.PI / 180);
      ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      ctx.restore();
    }

  }

  private async getBase64(image: HTMLImageElement, width: number, height: number, orientation: any) {
    let x: number;
    let y: number;
    let imgWidth: number;
    let imgHeight: number;

    switch (orientation) {
      default:
        [x, y, imgWidth, imgHeight, width, height] = this.getInfo(image.width, image.height, width, height, this.fitMode);
        this.toCanvas(image, x, y, imgWidth, imgHeight, width, height, 0);
        break;
      case 3:
        [x, y, imgWidth, imgHeight, width, height] = this.getInfo(image.width, image.height, width, height, this.fitMode);
        this.toCanvas(image, x, y, imgWidth, imgHeight, width, height, 180);
        break;
      case 6:
        [x, y, imgWidth, imgHeight, width, height] = this.getInfo(image.height, image.width, width, height, this.fitMode);
        this.toCanvas(image, x, y, imgHeight, imgWidth, width, height, 90);
        break;
      case 8:
        [x, y, imgWidth, imgHeight, width, height] = this.getInfo(image.height, image.width, width, height, this.fitMode);
        this.toCanvas(image, x, y, imgHeight, imgWidth, width, height, 270);
        break;
    }

    return this.canvas.toDataURL("image/" + this.imageType, 0.92);
  }
  private getBlob(filename: string, base64: string) {
    base64 = base64.split(',')[1];
    base64 = window.atob(base64);
    var ia = new Uint8Array(base64.length);
    for (var i = 0; i < base64.length; i++) {
      ia[i] = base64.charCodeAt(i);
    };

    // canvas.toDataURL 返回的默认格式就是 image/png
    return new File([ia], filename, { type: "image/" + this.imageType });
  }

  private detectImageAutomaticRotation() {
    return new Promise((resolve) => {
      if (this.isImageAutomaticRotation === undefined) {
        const img = new Image();

        img.onload = () => {
          // 如果图片变成 1x2，说明浏览器对图片进行了回正
          this.isImageAutomaticRotation = img.width === 1 && img.height === 2;

          resolve(this.isImageAutomaticRotation);
        };

        img.src = testAutoOrientationImageURL;
      } else {
        resolve(this.isImageAutomaticRotation);
      }
    });
  }

  private static getImageOrientation(url: string) {
    return undefined;
    // return new Promise((resolve) => {
    //   EXIF.getData(url, function () {
    //     let that=this;
    //     resolve(EXIF.getTag(this, 'Orientation'));
    //   });
    // });
  }
}


