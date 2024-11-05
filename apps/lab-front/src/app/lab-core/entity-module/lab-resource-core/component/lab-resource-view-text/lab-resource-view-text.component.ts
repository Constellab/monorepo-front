import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FlInfiniteScrollMode } from '@monorepo/front-core-lib';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { Observable } from 'rxjs';
import { RvResourceViewDirective, RvResourceViewText } from '@monorepo/resource-view';

/**
 * Component to view a resource as plain text
 *
 * Support pagination to previous or next page
 */
@Component({
  selector: 'lab-resource-view-text',
  templateUrl: './lab-resource-view-text.component.html',
  styleUrls: ['./lab-resource-view-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabResourceViewTextComponent
  extends RvResourceViewDirective<RvResourceViewText>
  implements OnInit
{
  @Input() view: RvResourceViewText;

  @Input() infiniteScrollMode: FlInfiniteScrollMode = 'body';

  text: string = '';

  reachedFirstPage: boolean = false;
  reachedLastPage: boolean = false;

  isLoading: boolean = false;

  constructor(
    private resourceService: LabResourceService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.initText();
  }

  private initText(): void {
    this.reachedFirstPage = this.view.data.is_first_page;
    this.reachedLastPage = this.view.data.is_last_page;

    this.text = this.toString(this.view.data.text);
  }

  loadNextPage(): void {
    if (this.view.data.is_last_page || this.view.data.next_page == null) return;
    this.isLoading = true;
    this.callPagination(this.view.data.next_page).subscribe({
      next: (view) => this.loadNextPageSuccess(view),
      error: () => this.onComplete(),
    });
  }

  private loadNextPageSuccess(view: RvResourceViewText): void {
    this.view.data.text += this.toString(view.data.text);
    this.text += this.toString(view.data.text);
    this.reachedLastPage = view.data.is_last_page;
    // refresh next page
    this.view.data.next_page = view.data.next_page;
    this.onComplete();
  }

  loadPreviousPage(): void {
    if (this.view.data.is_first_page || this.view.data.previous_page == null) return;
    this.isLoading = true;
    this.callPagination(this.view.data.previous_page).subscribe({
      next: (view) => this.loadPreviousPageSuccess(view),
      error: () => this.onComplete(),
    });
  }

  private callPagination(page: any): Observable<RvResourceViewText> {
    // merge config with pagination config
    const viewConfig = Object.assign(this.config.configValues, { [this.view.data.page_param_name]: page });

    return this.resourceService.callResourceViewData(
      this.resourceId,
      this.config.methodName,
      viewConfig
    ) as Observable<RvResourceViewText>;
  }

  private loadPreviousPageSuccess(view: RvResourceViewText): void {
    this.view.data.text = this.toString(view.data.text) + this.view.data;
    this.text = this.toString(view.data.text) + this.text;
    this.reachedFirstPage = view.data.is_first_page;
    // refresh previous page
    this.view.data.previous_page = view.data.previous_page;
    this.onComplete();
  }

  private onComplete(): void {
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  private toString(data: any): string {
    if (typeof data === 'string') {
      return data;
    } else {
      return JSON.stringify(data);
    }
  }
}
