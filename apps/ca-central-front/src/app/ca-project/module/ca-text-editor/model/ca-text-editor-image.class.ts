export interface CaTextEditorUploadedImage {
  filename: string;
  width: number;
  height: number;
}

/**
 * Config for the text editor to retrieve the image from their names
 */
export interface CaTextEditorImageLoader {

  getImageUrl(filename: string): string;
}
