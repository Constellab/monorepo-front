import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiVEnvPackages, LiVenvService } from '@monorepo/lab-lib/li-core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LiVenvPackageListDialogInput {
  venvName: string;
}

interface LiVenvPackageEntry {
  name: string;
  version: string;
}

@Component({
  selector: 'li-venv-package-list-dialog',
  templateUrl: './li-venv-package-list-dialog.component.html',
  styleUrls: ['./li-venv-package-list-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlSectionModule, TranslateModule],
})
export class LiVenvPackageListDialogComponent {
  input = inject<LiVenvPackageListDialogInput>(MAT_DIALOG_DATA);
  private venvService = inject(LiVenvService);

  venvPackages$: Observable<LiVenvPackageEntry[]> = this.venvService
    .getVenvPackages(this.input.venvName)
    .pipe(map((packages: LiVEnvPackages) => this.getPackageEntries(packages.packages)));

  private getPackageEntries(packages: Record<string, string>): LiVenvPackageEntry[] {
    return Object.entries(packages)
      .map(([name, version]) => ({ name, version }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
