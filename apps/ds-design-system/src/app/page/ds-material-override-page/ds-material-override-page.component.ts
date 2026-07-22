import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClTheme } from '@monorepo/core-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FL_ICONS_DEFAULT, FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import { DsExampleComponent } from '../../component/ds-example/ds-example.component';

interface DemoRow {
  name: string;
  type: string;
  size: string;
  status: string;
}

/**
 * Living showcase of the Material overrides defined in
 * libs/front-core-lib/src/style/fl-material-override.scss.
 * Each section groups a family of overrides with the class it demonstrates.
 */
@Component({
  selector: 'ds-material-override-page',
  templateUrl: './ds-material-override-page.component.html',
  styleUrl: './ds-material-override-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatOptionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    FlCardModule,
    FlCoreComponentModule,
    FlLoaderModule,
    FlIconModule,
    DsExampleComponent,
  ],
})
export class DsMaterialOverridePageComponent {
  private readonly themeService = inject(FlThemeService);
  private readonly flSnackBar = inject(FlSnackBarService);

  protected readonly isDark = signal(this.themeService.isDarkTheme());

  /** All custom FlIcons registered by the front-core-lib, shown by their registered name. */
  protected readonly customIcons = FL_ICONS_DEFAULT;

  // Form field demo controls
  protected readonly textControl = new FormControl('');
  protected readonly selectControl = new FormControl('option-one');
  protected readonly radioControl = new FormControl('a');

  // Table demo
  protected readonly displayedColumns = ['name', 'type', 'size', 'status'];
  protected readonly tableData: DemoRow[] = [
    { name: 'Sequence alignment', type: 'Scenario', size: '2.4 MB', status: 'Success' },
    { name: 'Raw reads', type: 'Resource', size: '18 MB', status: 'Success' },
    { name: 'QC report', type: 'View', size: '120 KB', status: 'Running' },
    { name: 'Reference genome', type: 'Resource', size: '640 MB', status: 'Draft' },
  ];

  protected toggleTheme(): void {
    const next = this.isDark() ? ClTheme.LIGHT_THEME : ClTheme.DARK_THEME;
    this.themeService.changeTheme(next);
    this.isDark.set(this.themeService.isDarkTheme());
  }

  protected openSuccessSnackbar(): void {
    this.flSnackBar.openSuccessMessage({ text: 'Changes saved successfully', translateText: false });
  }

  protected openSuccessSnackbarWithAction(): void {
    this.flSnackBar.openSuccessMessage({ text: 'Item moved to trash', translateText: false }, 5000, {
      showCloseButton: true,
      action: {
        label: { text: 'Undo', translateText: false },
        onClick: () => this.flSnackBar.openSuccessMessage({ text: 'Action undone', translateText: false }),
      },
    });
  }

  protected openErrorSnackbar(): void {
    this.flSnackBar.openErrorMessage({ text: 'Something went wrong', translateText: false });
  }
}
