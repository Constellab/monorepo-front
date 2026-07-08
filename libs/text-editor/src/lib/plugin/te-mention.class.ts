import { InlineTool, SanitizerConfig } from '@editorjs/editorjs';
import { ClPageI } from '@monorepo/core-lib';
import { FlDatasourceGetPageData } from '@monorepo/front-core-lib/fl-core';
import { FlHtmlHelper } from '@monorepo/front-core-lib/fl-core';
import { FlKeyboardKey } from '@monorepo/front-core-lib/fl-core';
import { FL_ROOT_INJECTOR } from '@monorepo/front-core-lib/fl-core';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlUser } from '@monorepo/front-core-lib/fl-user';
import { Observable } from 'rxjs';

import {
  TeMentionPortalComponent,
  TeMentionPortalInput,
} from '../component/te-mention-portal/te-mention-portal.component';
import { TeHelper } from '../model/te.helper';
import { TeElementInlineDirective } from '../model/te-element.directive';
import { TeKeyListener } from './te-key-listener.class';
import { TePortalPlugin } from './te-portal-plugin.class';

export interface TeMentionSearchFilter {
  text: string | null;
}

export interface TeMentionConfig {
  getUsers: (
    search: FlDatasourceGetPageData<TeMentionSearchFilter>,
    page: number,
    size: number
  ) => Observable<ClPageI<FlUser>>;
}

export const TE_MENTION_TAG_NAME = 'te-mention-inline';

export interface TeMentionUser {
  id: string;
  firstname: string;
  lastname: string;
}

export class TeMention extends TePortalPlugin {
  constructor(
    private config: TeMentionConfig,
    private event: KeyboardEvent
  ) {
    super();
  }

  protected buildKeyListener(): TeKeyListener {
    return new TeKeyListener(this.textNode, this.cursorOffset, FlKeyboardKey.AT, [
      FlKeyboardKey.ESCAPE,
      FlKeyboardKey.SPACE,
    ]);
  }

  protected onClose(user?: FlUser): void {
    if (user) {
      // replace the search text with mention element
      const positions = this.keyListener.getSearchTextPosition();
      const mentionElement = this.createMentionElement(user);
      FlHtmlHelper.replaceTextInNodeTextWithElement(
        this.textNode,
        positions.start,
        positions.end,
        mentionElement
      );

      // move the caret just after the mention
      FlHtmlHelper.setCaretAtElementPosition(mentionElement.nextSibling, 0);
    }
  }

  protected openPortal(): FlOverlayRef {
    const input: TeMentionPortalInput = {
      config: this.config,
      element: this.event.target as any,
      filter$: this.keyListener.getText$(),
      caretCoordinates: FlHtmlHelper.getCaretCoordinates(),
    };

    const portalService = FL_ROOT_INJECTOR.get(FlPortalService);

    const portalPosition = TeHelper.getPortalPositionForCursor(
      TeMentionPortalComponent.PORTAL_MAX_WIDTH,
      TeMentionPortalComponent.PORTAL_MAX_HEIGHT
    );

    const config = portalService.configureAbsolutePortal(portalPosition, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true,
    });

    // open the emoji picker
    return portalService.createPortal(TeMentionPortalComponent, config, input);
  }

  private createMentionElement(user: FlUser): HTMLElement {
    const mentionUser: TeMentionUser = { id: user.id, firstname: user.firstname, lastname: user.lastname };
    const mentionElement = document.createElement(TE_MENTION_TAG_NAME);
    mentionElement.setAttribute(TeElementInlineDirective.dataAttribute, JSON.stringify(mentionUser));
    return mentionElement;
  }
}

/**
 * Fake inline tool to allow to sanitize the mention element
 */
export class TeMentionInlineTool implements InlineTool {
  static get title(): string {
    return FL_ROOT_INJECTOR.get(FlTranslateService).translate('teTextEditor.variable');
  }

  static get isInline(): boolean {
    return true;
  }

  public static get sanitize(): SanitizerConfig {
    return {
      [TE_MENTION_TAG_NAME]: {
        'data-jsondata': true,
      },
    } as SanitizerConfig;
  }

  checkState(): boolean {
    return false;
  }

  /**
   * Do not show the tool in the toolbar
   */
  public render(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'none';
    return div;
  }

  surround(): void {}
}
