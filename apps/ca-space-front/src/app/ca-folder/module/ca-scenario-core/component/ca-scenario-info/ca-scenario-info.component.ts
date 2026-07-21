import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { TeBasicConfig, TeTextEditorModule } from '@monorepo/text-editor';

import { CaHierarchyObjectTagDatasource } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaSyncObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-sync-object-info/ca-sync-object-info.component';
import { CaValidatedObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-validated-object-info/ca-validated-object-info.component';

@Component({
  selector: 'ca-scenario-info',
  templateUrl: './ca-scenario-info.component.html',
  styleUrls: ['./ca-scenario-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CaValidatedObjectInfoComponent,
    CaSyncObjectInfoComponent,
    TeTextEditorModule,
    ReactiveFormsModule,
    FormsModule,
    FlTagModule,
  ],
})
export class CaScenarioInfoComponent {
  @Input() scenario: CaScenario;

  @Input() tags: CaHierarchyObjectTagDatasource;

  textEditorConfig = new TeBasicConfig();
}
