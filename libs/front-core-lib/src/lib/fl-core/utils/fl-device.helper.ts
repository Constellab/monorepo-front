export class FlDeviceHelper {
  public static isMac(): boolean {
    if (!navigator || !navigator.platform) {
      return false;
    }
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }
}
