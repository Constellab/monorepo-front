import { Component, Input, OnInit, inject } from '@angular/core';
import { LabBiotaDatabaseService } from '../../../../service/lab-biota-database.service';
import { LabBiotaDatabase } from '../../../../model/lab-biota-database.class';

/**
 * Card to display a database and load the database entries count
 */
@Component({
  selector: 'lab-biota-database-card',
  templateUrl: './lab-biota-database-card.component.html',
  styleUrls: ['./lab-biota-database-card.component.scss'],
  standalone: false,
})
export class LabBiotaDatabaseCardComponent implements OnInit {
  private biotaDatabaseService = inject(LabBiotaDatabaseService);

  @Input() database: LabBiotaDatabase;

  databasesEntries: number;

  ngOnInit(): void {
    this.getEntries();
  }

  private getEntries(): void {
    this.biotaDatabaseService.countDatabaseEntries(this.database.typingName).subscribe(
      (entries) => (this.databasesEntries = entries),
      () => (this.databasesEntries = 0)
    );
  }
}
