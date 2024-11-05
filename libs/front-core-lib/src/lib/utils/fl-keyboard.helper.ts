export enum FlKeyboardKey {
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  DELETE = 'Delete',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_DOWN = 'ArrowDown',
  ARROW_UP = 'ArrowUp',
  PAGE_DOWN = 'PageDown',
  PAGE_UP = 'PageUp',
  TAB = 'Tab',
  BACKSPACE = 'Backspace',
  SPACE = ' ',
  COLON = ':',
  AT = '@',
}

export class FlKeyboardHelper {
  public static keyboardKeyIsPrintable(key: string | FlKeyboardKey): boolean {
    return key?.length === 1;
  }

  /**
   * return true if the key is pressed with control pressed
   * @param event
   * @param key
   */
  public static keyboardEventIsCtrlAndKey(event: KeyboardEvent, key: string | FlKeyboardKey): boolean {
    if (event == null || key == null) {
      return false;
    }
    return event.key === key && event.ctrlKey;
  }

  /**
   * return true if the key is pressed with alt pressed
   * @param event
   * @param key
   */
  public static keyboardEventIsAltAndKey(event: KeyboardEvent, key: string | FlKeyboardKey): boolean {
    if (event == null || key == null) {
      return false;
    }
    return event.key === key && event.altKey;
  }

  /**
   * return true if the key event is any arrow
   * @param key
   */
  public static keyIsArrow(key: string | FlKeyboardKey): boolean {
    return (
      key === FlKeyboardKey.ARROW_RIGHT ||
      key === FlKeyboardKey.ARROW_LEFT ||
      key === FlKeyboardKey.ARROW_UP ||
      key === FlKeyboardKey.ARROW_DOWN
    );
  }

  /**
   * return true if the keypress event is '@'. only works for keypress event
   * @param key
   */
  public static keypressIsAt(key: string | FlKeyboardKey): boolean {
    return key === FlKeyboardKey.AT;
  }
}

export enum FlMouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}
