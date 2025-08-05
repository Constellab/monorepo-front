import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { LabBiotaDataDatasource } from '../../../../model/lab-biota-data.class';
import { LabBiotaDatabase, labBiotaDatabaseGroups } from '../../../../model/lab-biota-database.class';
import { LabBiotaDatabaseService } from '../../../../service/lab-biota-database.service';
import { LabBiotaDatabaseTableComponent } from '../../../lab-biota-core/lab-biota-database-table/lab-biota-database-table.component';

/**
 * component to show the detail of a biota database
 */
@Component({
  selector: 'lab-biota-database-detail-page',
  templateUrl: './lab-biota-database-detail-page.component.html',
  styleUrls: ['./lab-biota-database-detail-page.component.scss'],
  imports: [FlSectionModule, FlTextIconModule, FlCardModule, LabBiotaDatabaseTableComponent, TranslatePipe],
})
export class LabBiotaDatabaseDetailPageComponent implements OnInit {
  private biotaDatabaseService = inject(LabBiotaDatabaseService);
  private route = inject(ActivatedRoute);

  database: LabBiotaDatabase;

  datasource: LabBiotaDataDatasource;

  columns: string[] = ['id', 'name'];

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params.typingName));
  }

  private init(typingName: string): void {
    this.database = this.findDBFromType(typingName);
    this.datasource = this.biotaDatabaseService.getDatabaseDatasource(typingName);
  }

  // find the DB with the type
  private findDBFromType(type: string): LabBiotaDatabase {
    for (const group of labBiotaDatabaseGroups) {
      const database: LabBiotaDatabase = group.databases.find((d) => d.typingName === type);
      if (database != null) {
        return database;
      }
    }
    return null;
  }
}
