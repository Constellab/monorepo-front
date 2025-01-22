import { Component, Input } from '@angular/core';
import { LabNavigableEntityGrouped } from '../../../../model/entities/lab-navigable-entity.entity';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { LabNavigableEntitiesTableComponent } from '../lab-navigable-entities-table/lab-navigable-entities-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-navigable-entity-groups',
  templateUrl: './lab-navigable-entity-groups.component.html',
  styleUrls: ['./lab-navigable-entity-groups.component.scss'],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    FlIconModule,
    MatExpansionPanelContent,
    LabNavigableEntitiesTableComponent,
    TranslatePipe,
  ],
})
export class LabNavigableEntityGroupsComponent {
  @Input() groups: LabNavigableEntityGrouped[];
}
