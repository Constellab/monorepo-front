import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FlConfirmDialogInput, FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlImageModule, FlUploadImageDialogConfig } from '@monorepo/front-core-lib/fl-image';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { HaCommunityApp } from '../../../ha-core/ha-model/ha-entities/ha-community-app.class';
import { HaAppPicturePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-app-picture/ha-app-picture.pipe';
import { HaCommunityAppService } from '../../../ha-core/ha-service/ha-community-app.service';
import { HaCommunityAppState } from '../../state/ha-community-app.state';

@Component({
  selector: 'ha-community-app-media-edit-dialog',
  templateUrl: './ha-community-app-media-edit-dialog.component.html',
  styleUrls: ['./ha-community-app-media-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    TranslatePipe,
    MatFormFieldModule,
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    FlImageModule,
    MatIcon,
    HaAppPicturePipe,
    MatIconButton,
    MatTooltip,
  ],
})
export class HaCommunityAppMediaEditDialogComponent {
  private communityAppState = inject(HaCommunityAppState);
  private communityAppService = inject(HaCommunityAppService);

  app: Signal<HaCommunityApp | null> = this.communityAppState.app;

  videoUrlFormControl = computed(() => {
    const app = this.app();
    if (!app) return new FormControl<string | null>(null);
    return new FormControl<string | null>(app.video ?? null);
  });

  saveVideo(): void {
    const app = this.requireApp();
    let video = this.videoUrlFormControl().value;
    if (app.video === video) return;
    if (video?.length == 0) video = null;
    this.communityAppService.updateAppMedia(app.id, video, app.figures ?? []).subscribe((communityApp) => {
      this.communityAppState.set(communityApp);
    });
  }

  private requireApp(): HaCommunityApp {
    const app = this.app();
    if (app == null) {
      throw new Error('HaCommunityAppMediaEditDialogComponent used without a loaded app');
    }
    return app;
  }

  getImageConfig(figure?: string): FlUploadImageDialogConfig {
    return {
      title: { text: 'upload_app_figure', translateText: true },
      imagePreviewWidth: 204,
      imagePreviewHeight: 115,
      uploadImage: (file: File) => {
        return this.communityAppService.uploadAppPicture(file).pipe(
          mergeMap((res: any) => {
            if (!res || !res.filename) return of(null);
            const filename = res.filename;
            return (figure ? this.deleteFigure(figure) : of(null)).pipe(
              mergeMap(() => {
                const app = this.requireApp();
                app.figures = app.figures || [];
                app.figures.push(filename);
                return this.communityAppService.updateAppMedia(app.id, app.video ?? '', app.figures);
              })
            );
          }),
          map((communityApp: HaCommunityApp) => {
            this.communityAppState.set(communityApp);
            return communityApp;
          })
        );
      },
      uploadImageSuccessMessage: {
        text: 'app_figure_uploaded',
        translateText: true,
      },
    };
  }

  getDeleteImageConfig(figure: string): FlConfirmDialogInput {
    return {
      title: 'delete_app_figure',
      content: 'delete_app_figure_confirmation',
      observable: this.deleteFigure(figure),
      successMessage: 'app_figure_deleted',
    };
  }

  getReorderActions(index: number): FlMenuDynamic[] {
    const app = this.requireApp();
    const actions: FlMenuDynamic[] = [];

    if (index > 0) {
      actions.push({
        text: { text: 'move_left', translateText: true },
        icon: 'arrow_back',
        type: 'button',
        onClick: () => this.moveFigureUp(index),
      });
    }

    if (index < (app.figures?.length ?? 0) - 1) {
      actions.push({
        text: { text: 'move_right', translateText: true },
        icon: 'arrow_forward',
        type: 'button',
        onClick: () => this.moveFigureDown(index),
      });
    }

    return actions;
  }

  private deleteFigure(figure: string): Observable<any> {
    return this.communityAppService.deleteFile(figure).pipe(
      mergeMap(() => {
        const app = this.requireApp();
        app.figures = (app.figures || []).filter((f) => f !== figure);
        return this.communityAppService.updateAppMedia(app.id, app.video ?? '', app.figures);
      }),
      map((communityApp: HaCommunityApp) => {
        this.communityAppState.set(communityApp);
      })
    );
  }

  moveFigureUp(index: number): void {
    if (index === 0) return;
    const app = this.requireApp();
    const figures = [...(app.figures ?? [])];
    [figures[index - 1], figures[index]] = [figures[index], figures[index - 1]];
    this.rearrangeFigures(figures);
  }

  moveFigureDown(index: number): void {
    const app = this.requireApp();
    if (index === (app.figures?.length ?? 0) - 1) return;
    const figures = [...(app.figures ?? [])];
    [figures[index], figures[index + 1]] = [figures[index + 1], figures[index]];
    this.rearrangeFigures(figures);
  }

  private rearrangeFigures(figures: string[]): void {
    const app = this.requireApp();
    this.communityAppService.rearrangeMedias(app.id, figures).subscribe((communityApp) => {
      this.communityAppState.set(communityApp);
    });
  }
}
