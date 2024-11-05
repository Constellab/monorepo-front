import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaNoteDetailPageComponent } from './component/ca-note-detail-page/ca-note-detail-page.component';
import { CaNoteDetailComponent } from './component/ca-note-detail/ca-note-detail.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CaScenarioCoreModule } from '../ca-scenario-core/ca-scenario-core.module';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import { CaNoteCoreModule } from '../ca-note-core/ca-note-core.module';

@NgModule({
  declarations: [CaNoteDetailPageComponent, CaNoteDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    CaCoreModule,
    CaFolderHierarchyCoreModule,
    CaScenarioCoreModule,
    CaNoteCoreModule,
  ],
})
export class CaNoteDetailPageModule {}
