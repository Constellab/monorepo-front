import { Component, Input } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { TeBasicConfig, TeTextEditorModule } from '@monorepo/text-editor';
import { CaValidatedObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-validated-object-info/ca-validated-object-info.component';
import { CaSyncObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-sync-object-info/ca-sync-object-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaHierarchyObjectTagDatasource } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';

@Component({
  selector: 'ca-scenario-info',
  templateUrl: './ca-scenario-info.component.html',
  styleUrls: ['./ca-scenario-info.component.scss'],
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
