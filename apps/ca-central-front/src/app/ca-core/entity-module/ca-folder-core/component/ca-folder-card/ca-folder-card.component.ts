import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaFolder } from '../../../../model/entities/project/ca-folder.class';

@Component({
  selector: 'ca-folder-card',
  templateUrl: './ca-folder-card.component.html',
  styleUrl: './ca-folder-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaFolderCardComponent {

  @Input({required: true}) folder: CaFolder;
}
