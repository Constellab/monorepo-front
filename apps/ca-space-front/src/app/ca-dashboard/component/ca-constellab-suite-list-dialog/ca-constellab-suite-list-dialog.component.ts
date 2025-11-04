import { Component } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { CaDashboardConstellabSuiteComponent } from '../ca-dashboard-constellab-suite/ca-dashboard-constellab-suite.component';

@Component({
  selector: 'ca-constellab-suite-list-dialog',
  templateUrl: './ca-constellab-suite-list-dialog.component.html',
  styleUrls: ['./ca-constellab-suite-list-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, CaDashboardConstellabSuiteComponent, TranslatePipe],
})
export class CaConstellabSuiteListDialogComponent {}
