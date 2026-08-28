import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TD_TYPE_STYLE_DEFAULT, TdTypingName } from '@monorepo/technical-doc';

import { PrProtocol } from '../../model/pr-protocol.class';
import { PrProcessConfigInfoDialogComponent } from '../pr-process-config-info-dialog/pr-process-config-info-dialog.component';

/**
 * Component to show info about a process
 */
@Component({
  selector: 'pr-process-info',
  templateUrl: './pr-process-info.component.html',
  styleUrl: './pr-process-info.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrProcessInfoComponent implements OnInit {
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) process: PrProtocol;

  @Input() communityHelper: CoCommunityHelperService;

  docUrl: string;
  typingName: TdTypingName;

  // stopgap: process.style is honestly `TdTypeStyle | null` (PrProtocol), but
  // TdTypeInlineComponent.style (technical-doc, out of scope here) is a required non-null
  // input; it falls back to TD_TYPE_STYLE_DEFAULT internally, so we mirror that at the binding site
  readonly tdTypeStyleDefault = TD_TYPE_STYLE_DEFAULT;

  ngOnInit(): void {
    this.typingName = new TdTypingName(this.process.process_typing_name);
    if (this.communityHelper) {
      this.docUrl = this.communityHelper.getTechnicalDocUrl(
        this.typingName,
        this.process.brick_version_on_run
      );
    }
  }

  openConfigDetail(): void {
    this.dialogService.openBigDialog(PrProcessConfigInfoDialogComponent, { data: this.process.config });
  }
}
