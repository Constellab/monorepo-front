import { NgModule } from '@angular/core';
import { HaStoryRoutingModule } from './ha-story-routing.module';
import { HaStoryPageComponent } from './module/ha-story-page/ha-story-page.component';
import { HaStoryEditPageComponent } from './module/ha-story-edit-page/ha-story-edit-page.component';
import { HaStoryListPageComponent } from './module/ha-story-list-page/ha-story-list-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HaCoreModule } from '../ha-core/ha-core.module';
import { HaStoryCreateDialogComponent } from './module/ha-story-create-dialog/ha-story-create-dialog.component';
import { CommonModule } from '@angular/common';
import { HaStoryMyListComponent } from './module/ha-story-my-list/ha-story-my-list.component';
import { HaStoryCoAuthorDialogComponent } from './module/ha-story-co-author-dialog/ha-story-co-author-dialog.component';
import { HaStoryInvitePageComponent } from './module/ha-story-invite-page/ha-story-invite-page.component';
import { HaStoryFileDialogComponent } from './module/ha-story-file-dialog/ha-story-file-dialog.component';
import {FlInputFileModule} from '@monorepo/front-core-lib';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    HaStoryPageComponent,
    HaStoryEditPageComponent,
    HaStoryListPageComponent,
    HaStoryCreateDialogComponent,
    HaStoryMyListComponent,
    HaStoryCoAuthorDialogComponent,
    HaStoryInvitePageComponent,
    HaStoryFileDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    HaStoryRoutingModule,
    HaCoreModule,
    FlInputFileModule,
    MatTooltipModule,
  ],
})
export class HaStoryModule {}
