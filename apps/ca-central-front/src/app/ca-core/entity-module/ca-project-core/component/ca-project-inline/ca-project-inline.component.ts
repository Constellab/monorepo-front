import { Component, Input } from '@angular/core';
import { CaProject } from '../../../../model/entities/project/ca-project.class';

@Component({
  selector: 'ca-project-inline',
  templateUrl: './ca-project-inline.component.html',
  styleUrls: ['./ca-project-inline.component.scss']
})
export class CaProjectInlineComponent {

  @Input({ required: true }) project: CaProject;

}
