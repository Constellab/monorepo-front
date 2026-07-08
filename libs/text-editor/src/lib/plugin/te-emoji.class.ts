import { FlHtmlHelper } from '@monorepo/front-core-lib/fl-core';
import { FlKeyboardKey } from '@monorepo/front-core-lib/fl-core';
import { FL_ROOT_INJECTOR } from '@monorepo/front-core-lib/fl-core';
import { FlEmojiPickerPortalComponent } from '@monorepo/front-core-lib/fl-emoji-picker';
import { FlEmojiPickerPortalInput } from '@monorepo/front-core-lib/fl-emoji-picker';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import { TeHelper } from '../model/te.helper';
import { TeKeyListener } from './te-key-listener.class';
import { TePortalPlugin } from './te-portal-plugin.class';

export class TeEmoji extends TePortalPlugin {
  private waitListener: (event: KeyboardEvent) => void;

  constructor(private event: KeyboardEvent) {
    super();
  }

  protected buildKeyListener(): TeKeyListener {
    return new TeKeyListener(this.textNode, this.cursorOffset, FlKeyboardKey.COLON, [
      FlKeyboardKey.ESCAPE,
      FlKeyboardKey.SPACE,
    ]);
  }

  /**
   * Wait for the user to type at least one character after ":" before opening the emoji picker.
   */
  protected override schedulePortalOpen(): void {
    this.waitListener = () => {
      if (this.keyListener.isCompleted()) {
        document.removeEventListener('keyup', this.waitListener);
        return;
      }
      const text = this.keyListener.getCurrentText();
      if (text.length > 0) {
        document.removeEventListener('keyup', this.waitListener);
        this.callPortal();
      }
    };
    document.addEventListener('keyup', this.waitListener);
  }

  protected onClose(emoji: string): void {
    if (emoji) {
      // replace the search text with the emoji
      const positions = this.keyListener.getSearchTextPosition();
      this.textNode.textContent =
        this.textNode.textContent.slice(0, positions.start) +
        emoji +
        this.textNode.textContent.slice(positions.end);

      // move the caret just after the emoji
      // +2 otherwise the cursor seems to be inside the emoji
      FlHtmlHelper.setCaretAtElementPosition(this.textNode, this.cursorOffset + 2);
    }
  }

  protected openPortal(): FlOverlayRef {
    const input: FlEmojiPickerPortalInput = {
      filter: this.keyListener.getText$(),
      element: this.event.target as any,
    };

    // open portal
    const portalService = FL_ROOT_INJECTOR.get(FlPortalService);
    const portalPosition = TeHelper.getPortalPositionForCursor(
      FlEmojiPickerPortalComponent.PORTAL_MAX_WIDTH,
      FlEmojiPickerPortalComponent.PORTAL_MAX_HEIGHT
    );
    const config = portalService.configureAbsolutePortal(portalPosition, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true,
    });

    // open the emoji picker
    return portalService.createPortal(FlEmojiPickerPortalComponent, config, input);
  }
}
