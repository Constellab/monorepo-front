import { Component, Input } from '@angular/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiNavigableEntitiesTableComponent } from '../li-navigable-entities-table/li-navigable-entities-table.component';
import { LiNavigableEntityGrouped } from '@monorepo/lab-lib/li-core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-navigable-entity-groups',
  templateUrl: './li-navigable-entity-groups.component.html',
  styleUrls: ['./li-navigable-entity-groups.component.scss'],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    FlIconModule,
    MatExpansionPanelContent,
    LiNavigableEntitiesTableComponent,
    TranslatePipe,
  ],
})
export class LiNavigableEntityGroupsComponent {
  @Input() groups: LiNavigableEntityGrouped[];
}
