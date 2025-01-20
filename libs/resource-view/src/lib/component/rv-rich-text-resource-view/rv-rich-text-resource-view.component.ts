import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RvResourceViewBase } from '../../model/rv-resource-view.class';
import { RvViewConfig } from '../../model/rv-view-config.class';
import { Observable } from 'rxjs';

/**
 * Component to show a resource view inside a rich text editor.
 */
@Component({
    selector: 'rv-rich-text-resource-view',
    templateUrl: './rv-rich-text-resource-view.component.html',
    styleUrls: ['./rv-rich-text-resource-view.component.scss'],
    standalone: false
})
export class RvRichTextResourceViewComponent implements OnInit {
  @Input({ required: true }) view$: Observable<RvResourceViewBase>;

  @Input() resourceId?: string;

  @Input() viewConfig?: RvViewConfig;

  @Input() viewTitle: string;
  @Output() viewTitleChange: EventEmitter<string> = new EventEmitter();

  @Input() caption: string;
  @Output() captionChange: EventEmitter<string> = new EventEmitter();

  @Input() editable: boolean;

  view: RvResourceViewBase;

  isLoading: boolean = false;
  error: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.isLoading = true;
    this.view$.subscribe({
      next: (view) => this.onSuccess(view),
      error: () => this.onError(),
    });
  }

  private onSuccess(view: RvResourceViewBase): void {
    this.view = view;
    this.isLoading = false;
    this.error = false;
  }

  private onError(): void {
    this.isLoading = false;
    this.error = true;
  }

  onTitleChange(title: string): void {
    this.viewTitle = title;
    this.viewTitleChange.emit(title);
  }

  onCaptionChange(caption: string): void {
    this.caption = caption;
    this.captionChange.emit(caption);
  }
}
