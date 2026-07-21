import { TemplatePortal } from '@angular/cdk/portal';
import { AfterContentInit, ChangeDetectionStrategy,Component, ContentChild, inject, Input, ViewContainerRef } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';

import { FlSectionBodyDirective } from '../fl-section-body';

/**
 * Component to display a section containing an object or a list
 *
 * If the object or list if loading or the object list is empty,
 * it doesn't render the section-body
 * To use the section-body, use <ng-template genSectionBody>
 */
@Component({
  selector: 'fl-section',
  templateUrl: './fl-section.component.html',
  styleUrls: ['./fl-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlSectionComponent implements AfterContentInit {
  private viewContainerRef = inject(ViewContainerRef);

  _isLoading: boolean = false;
  @Input() set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
    this.lazyRender();
  }

  _object: any = null;

  @Input() set object(object: any) {
    this._object = object;
    this.lazyRender();
  }

  @Input() emptyText: string = 'flSection.object_not_found';

  @Input() disableEmptyText: boolean = false;

  /** Content that will be rendered lazily. */
  @ContentChild(FlSectionBodyDirective) private lazyContent: FlSectionBodyDirective<any>;

  /** Portal holding the user's content. */
  portal: TemplatePortal;

  ngAfterContentInit(): void {
    this.lazyRender();
  }

  // if it returns true, the section body is rendered
  get renderBody(): boolean {
    return !this._isLoading && !this.objectIsNullOrEmpty;
  }

  get objectIsNullOrEmpty(): boolean {
    return !this.disableEmptyText && ClHelpService.isNullOrEmpty(this._object);
  }

  lazyRender(): void {
    // if we can render the portal
    if (this.lazyContent && this.renderBody) {
      // don't re-create the portal if already present
      if (this.portal == null) {
        this.portal = new TemplatePortal(this.lazyContent._template, this.viewContainerRef);
      }
    } else {
      this.portal = null;
    }
  }
}
