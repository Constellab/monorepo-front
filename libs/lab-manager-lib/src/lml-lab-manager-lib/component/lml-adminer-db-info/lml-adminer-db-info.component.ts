import { Component, inject, input } from '@angular/core';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';

import { LmlAdminerDbInfo } from '../../model/lml-lab-manager.class';

@Component({
  selector: 'lml-adminer-db-info',
  templateUrl: './lml-adminer-db-info.component.html',
  styleUrl: './lml-adminer-db-info.component.scss',
  standalone: false,
})
export class LmlAdminerDbInfoComponent {
  adminerDbInfo = input.required<LmlAdminerDbInfo>();

  showPassword = false;

  private clipboardService = inject(FlClipboardService);

  copyPassword(): void {
    this.clipboardService.copy(this.adminerDbInfo().password, 'flCoreComponent.copied_to_clipboard');
  }
}
