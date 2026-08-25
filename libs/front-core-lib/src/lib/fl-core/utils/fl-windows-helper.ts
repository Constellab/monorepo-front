export class FlWindowsHelper {
  private static blockFunction: ((event: BeforeUnloadEvent) => string) | null = null;

  public static blockWindowsClose(): void {
    if (FlWindowsHelper.blockFunction != null) {
      return;
    }
    FlWindowsHelper.blockFunction = (event): string => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', FlWindowsHelper.blockFunction);
  }

  public static unblockWindowsClose(): void {
    if (FlWindowsHelper.blockFunction == null) {
      return;
    }
    window.removeEventListener('beforeunload', FlWindowsHelper.blockFunction);
    FlWindowsHelper.blockFunction = null;
  }
}
