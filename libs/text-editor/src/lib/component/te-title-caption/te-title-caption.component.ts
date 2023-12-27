import {Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FlDialogService} from '@monorepo/front-core-lib';


/**
 * Component inside text editor to show title and caption with possibility to edit them
 */
@Component({
  selector: 'te-title-caption',
  templateUrl: './te-title-caption.component.html',
  styleUrls: ['./te-title-caption.component.scss']
})
export class TeTitleCaptionComponent implements OnDestroy {

  @Input() title: string;
  @Output() titleChange: EventEmitter<string> = new EventEmitter();

  @Input() caption: string;
  @Output() captionChange: EventEmitter<string> = new EventEmitter();

  @Input() editable: boolean;

  @ViewChild('templatePortalContent') templatePortalContent: TemplateRef<unknown>;

  private dialogRef: MatDialogRef<any>;

  constructor(private dialogService: FlDialogService) {
  }

  openEditDialog(): void {
    this.dialogRef = this.dialogService.openSmallDialog(this.templatePortalContent);
  }

  closeDialog(): void {
    this.dialogRef?.close();
    this.titleChange.next(this.title);
    this.captionChange.next(this.caption);
  }

  ngOnDestroy(): void {
    this.closeDialog();
  }
}
