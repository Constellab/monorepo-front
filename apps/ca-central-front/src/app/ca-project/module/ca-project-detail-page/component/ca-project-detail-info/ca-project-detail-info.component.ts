import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaProject } from '../../../../../ca-core/model/entities/project/ca-project.class';
import { CaProjectDetailState } from '../../state/ca-project-detail.state';

@Component({
  selector: 'ca-project-detail-info',
  templateUrl: './ca-project-detail-info.component.html',
  styleUrl: './ca-project-detail-info.component.scss'
})
export class CaProjectDetailInfoComponent {

  project$: Observable<CaProject> = inject(CaProjectDetailState).getProject$();
}
