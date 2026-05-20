import { Router } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlBaseActionMenu, FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  LiEntityActionButton,
  LiEntityActionMenu as LiEntityActionMenuDto,
  LiEntityActionResult,
  LiEntityActionService,
  LiEntityActionType,
  LiEntityTagType,
  LiTagDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { catchError, map, Observable, of } from 'rxjs';

import { LiManageEntityTagsDialogComponent, LiManageEntityTagsDialogInput } from '../li-tag';

/**
 * Base action menu for lab entities. Provides reusable menu items
 * (tags, plugin-contributed extensions) that any entity menu can include.
 *
 * Subclasses (e.g. LiScenarioActionMenu, LiResourceActionMenu) build their
 * own static menu items and compose them with these shared helpers.
 */
export class LiEntityActionMenu extends FlBaseActionMenu {
  /**
   * Returns a "Tags" button that opens the tag management dialog.
   * @param tags optional shared datasource (e.g. from a detail page tag list).
   *             If omitted, tags are loaded lazily on click.
   */
  protected getTagsButton(
    entityType: LiEntityTagType,
    entityId: string,
    tags?: LiTagDatasource
  ): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.tags',
      icon: 'tag',
      onClick: () => this.openTagsFormDialog(entityId, entityType, tags),
    };
  }

  private openTagsFormDialog(entityId: string, entityType: LiEntityTagType, tags?: LiTagDatasource): void {
    const resolvedTags =
      tags ?? this.injector.get(LiTagService).getEntityTagsDatasource(entityType, entityId);
    const data: LiManageEntityTagsDialogInput = {
      entityType: entityType,
      entityId: entityId,
      tags: resolvedTags,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiManageEntityTagsDialogComponent, { data: data })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  /**
   * Fetches plugin-contributed actions from the backend and returns an
   * "Extensions" submenu button wrapping them as children.
   *
   * Returns `null` when no plugin actions exist. Designed to be pushed
   * directly into a `FlMenuDynamicInput` array so the menu renders static
   * items immediately while extensions load asynchronously.
   */
  protected getExtensionsButton(
    entityType: LiEntityActionType,
    entityId: string
  ): Observable<FlMenuDynamic | null> {
    const service = this.injector.get(LiEntityActionService);

    return service.getEntityActions(entityType, entityId).pipe(
      map((actions) => {
        const children = actions.map((action) => this.mapEntityAction(entityType, entityId, action));
        if (children.length === 0) {
          return null;
        }

        return {
          type: 'button' as const,
          text: 'li.extensions',
          icon: 'extension',
          divider: true,
          children,
        };
      }),
      catchError((err) => {
        console.error('[LiEntityActionMenu] failed to load extensions', err);
        return of(null);
      })
    );
  }

  /** Maps a backend entity action DTO to a FlMenuDynamic item. */
  private mapEntityAction(
    entityType: LiEntityActionType,
    entityId: string,
    action: LiEntityActionMenuDto
  ): FlMenuDynamic {
    if (action.type === 'link') {
      return {
        type: 'link',
        text: { text: action.text, translateText: false },
        link: action.link,
        icon: action.icon,
        divider: action.divider,
        color: action.color,
      };
    }

    const button: LiEntityActionButton = action;
    return {
      type: 'button',
      text: { text: button.text, translateText: false },
      icon: button.icon,
      divider: button.divider,
      disabled: button.disabled,
      color: button.color,
      children: button.children?.map((child) => this.mapEntityAction(entityType, entityId, child)),
      onClick: () => this.callEntityAction(entityType, entityId, button.action_name),
    };
  }

  /** Executes a named plugin action and handles the result (navigation, snackbar). */
  private callEntityAction(entityType: LiEntityActionType, entityId: string, actionName: string): void {
    this.injector
      .get(LiEntityActionService)
      .callEntityAction(entityType, entityId, actionName)
      .subscribe((result) => this.handleEntityActionResult(result));
  }

  private handleEntityActionResult(result: LiEntityActionResult): void {
    if (result?.navigate_to) {
      const isExternalUrl = /^https?:\/\//.test(result.navigate_to);

      if (!isExternalUrl && !result.open_in_new_tab) {
        this.injector.get(Router).navigate([result.navigate_to], {
          queryParams: result.navigate_query_params,
        });
      } else {
        const url = isExternalUrl
          ? this.buildExternalUrl(result.navigate_to, result.navigate_query_params)
          : this.injector.get(Router).serializeUrl(
              this.injector.get(Router).createUrlTree([result.navigate_to], {
                queryParams: result.navigate_query_params,
              })
            );
        window.open(url, result.open_in_new_tab ? '_blank' : '_self');
      }
    }

    if (result?.message) {
      this.injector.get(FlSnackBarService).openSuccessMessage({ text: result.message, translateText: false });
    }
  }

  private buildExternalUrl(baseUrl: string, queryParams?: Record<string, string>): string {
    const url = new URL(baseUrl);
    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  }
}
