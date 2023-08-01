import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabProject, LabProjectWithChildren} from '../../../../model/entities/lab-project.class';
import {FlMenuDynamic, FlPortalService} from '@monorepo/front-core-lib';
import {LabProjectService} from '../../../../entity-service/lab-project.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  LabProjectSelectPortalComponent,
  LabProjectSelectPortalResult
} from '../lab-project-select-portal/lab-project-select-portal.component';

/**
 * Show project information in a compact way
 */
@Component({
  selector: 'lab-project-inline',
  templateUrl: './lab-project-inline.component.html',
  styleUrls: ['./lab-project-inline.component.scss']
})
export class LabProjectInlineComponent implements OnInit {

  @Input() project: LabProject;

  @Output() selectionChange: EventEmitter<LabProject | null> = new EventEmitter();

  menuDynamics$: Observable<FlMenuDynamic[]>;

  constructor(private projectService: LabProjectService,
              private portalService: FlPortalService) {
  }

  ngOnInit(): void {
    this.menuDynamics$ = this.projectService.getProjectTrees().pipe(
      map(projects => this.onProjectTreeSuccess(projects))
    );
  }

  private onProjectTreeSuccess(projects: LabProjectWithChildren[]): FlMenuDynamic[] {
    const menu = projects.map(project => this.projectTreeToFlMenuDynamic(project));
    menu.unshift({
      type: 'button',
      onClick: () => this.selectProject(null),
      text: {text: 'select_none', translateText: true},
    });
    return menu;
  }

  private projectTreeToFlMenuDynamic(project: LabProjectWithChildren): FlMenuDynamic {
    let onClick: () => void;
    if (project?.children.length > 0) {
      //ignore click on parent project
      onClick = () => {
      };
    } else {
      onClick = () => this.selectProject(project);
    }
    return {
      type: 'button',
      text: project.code,
      subText: project.title,
      children: project.children.map(child => this.projectTreeToFlMenuDynamic(child)),
      onClick: onClick
    };
  }

  private selectProject(project: LabProject): void {
    if (this.project?.id === project?.id || this.project == null && project == null) return;
    this.selectionChange.next(project);
  }

  openPortal(event: MouseEvent): void {

    const config = this.portalService.configureRelativePortalFromMouseEvent(event,
      ['bottom'],
      {
        disposeOnNavigation: true,
        disposeOnOutsideClick: true
      });

    this.portalService.createPortal(LabProjectSelectPortalComponent, config, this.project).detachments().subscribe(
      project => this.onPortalClosed(project)
    );
  }

  private onPortalClosed(result: LabProjectSelectPortalResult): void {
    if (result == null) return;

    this.selectProject(result.project);
  }

}
