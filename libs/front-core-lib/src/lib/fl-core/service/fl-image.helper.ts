export interface FlCompressBlobOption {
  /**
   * The maximum width of the compressed image
   */
  resizeWidthMax: number;

  /**
   * The width of the image after the crop (default is resizeWidthMax)
   */
  cropWidth?: number;

  /**
   * The height of the image after the crop (default is resizeHeightMax)
   */
  cropHeight: number;
}

export class FlImageHelper {
  /***
   * Use this method to compress and resize a blob
   *
   * @param blob is the blob to resize
   * @param options is the options to resize the image
   */
  public static async compressBlob(blob: Blob, options: FlCompressBlobOption): Promise<File> {
    const blobUrl: string = URL.createObjectURL(blob);
    const loadImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
        img.src = url;
      });
    const img = await loadImage(blobUrl);
    let [newWidth, newHeight] = FlImageHelper.calculateSize(img, options.resizeWidthMax);
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const cropWidth: number = options.cropWidth ?? options.resizeWidthMax;
    canvas.width = cropWidth;
    canvas.height = options.cropHeight;
    let xBegin: number = 0;
    let yBegin: number = 0;
    if (newWidth > cropWidth) {
      xBegin = Math.round((newWidth - cropWidth) / 2);
    } else {
      newWidth = cropWidth;
    }
    if (newHeight > options.cropHeight) {
      yBegin = Math.round((newHeight - options.cropHeight) / 2);
    } else {
      newHeight = options.cropHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to get the 2d context of the canvas');
    }
    ctx.drawImage(img, -xBegin, -yBegin, newWidth, newHeight);
    const compressedBlob: Blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((newBlob) =>
        newBlob ? resolve(newBlob) : reject(new Error('Unable to compress the image'))
      )
    );
    return FlImageHelper.blobToFile(compressedBlob);
  }

  /***
   * Calcul the new size of the image
   * @param img
   * @param maxW
   */
  public static calculateSize(img: HTMLImageElement, maxW: number = 960): [number, number] {
    let width: number = img.width;
    let height: number = img.height;

    if (width > maxW) {
      height = Math.round((height * maxW) / width);
      width = maxW;
    }

    return [width, height];
  }

  public static blobToUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  public static blobToFile(blob: Blob): File {
    return new File([blob], 'image.png', { type: 'image/png' });
  }
}
