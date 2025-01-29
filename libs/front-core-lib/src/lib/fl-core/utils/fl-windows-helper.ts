export class FlWindowsHelper {
  private static blockFunction: (event: BeforeUnloadEvent) => string = null;
  private static blockCount = 0;

  public static blockWindowsClose(): void {
    FlWindowsHelper.blockCount++;
    if (FlWindowsHelper.blockFunction == null) {
      FlWindowsHelper.blockFunction = (event): string => {
        event.preventDefault();
        event.returnValue = '';
        return '';
      };
      window.addEventListener('beforeunload', FlWindowsHelper.blockFunction);
    }
  }

  public static unblockWindowsClose(): void {
    FlWindowsHelper.blockCount--;
    if (FlWindowsHelper.blockCount <= 0) {
      FlWindowsHelper.blockCount = 0;

      if (FlWindowsHelper.blockFunction != null) {
        window.removeEventListener('beforeunload', FlWindowsHelper.blockFunction);
        FlWindowsHelper.blockFunction = null;
      }
    }
  }
}
