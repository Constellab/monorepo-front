import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';

@Component({
  selector: 'ca-folder-detail-info',
  templateUrl: './ca-folder-detail-info.component.html',
  styleUrl: './ca-folder-detail-info.component.scss'
})
export class CaFolderDetailInfoComponent {

  folder$: Observable<CaFolder> = inject(CaFolderDetailState).getFolder$();
}
