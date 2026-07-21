import { ChangeDetectionStrategy,Component, effect, inject, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaBrickVersionDataSource } from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaNodeDTO } from '../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaNewVersionDTO } from '../../../ha-core/ha-model/ha-entities/ha-version.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaBrickVersionService } from '../../../ha-core/ha-service/ha-brick-version.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../state/ha-brick-page.state';
import { HaAddVersionDialogComponent } from '../ha-add-version-dialog/ha-add-version-dialog.component';
import { HaBrickVersionsTableComponent } from '../ha-brick-versions-table/ha-brick-versions-table.component';

@Component({
  selector: 'ha-brick-versions-page',
  templateUrl: './ha-brick-versions.component.html',
  styleUrls: ['./ha-brick-versions.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButton, HaBrickVersionsTableComponent, TranslatePipe, FlCorePipeModule],
})
export class HaBrickVersionsComponent extends HaCommunityPageDirective {
  private brickVersionService: HaBrickVersionService = inject(HaBrickVersionService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);
  private router: Router = inject(Router);

  brickVersions: HaBrickVersionDataSource;
  brick: Signal<HaBrick> = this.brickPageState.brick;
  userHasEditRight: Signal<boolean> = this.brickPageState.userHasEditRight;

  constructor() {
    super();

    effect(() => {
      const brick = this.brick();
      if (brick) this.init(brick);
    });
  }

  private init(brick: HaBrick): void {
    super.setMetaTags(
      { text: 'ha.versions.brick.title', translateParam: { param: { brickTitle: brick.name } } },
      { text: 'ha.versions.brick.description', translateParam: { param: { brickTitle: brick.name } } },
      brick.imageLink,
      HaRouterService.getFullRoute(this.router.url)
    );
    this.setDataSource(brick);
  }

  openNewVersionDialog(brickName: string): void {
    const input: FlFormDialogInput<HaNewVersionDTO> = {
      mode: 'create',
      object: {
        version: null,
        repoType: null,
        commit: null,
        brickName: brickName,
        subPatch: null,
        isBeta: false,
      } as HaNewVersionDTO,
    };

    this.dialogService
      .openSmallDialog(HaAddVersionDialogComponent, { data: input })
      .afterClosed()
      .subscribe((res: HaNodeDTO) => {
        if (res != null) {
          this.setDataSource(this.brick());
        }
      });
  }

  private setDataSource(brick: HaBrick): void {
    this.brickVersions = this.brickVersionService.getDataSource(brick.id);
  }
}
