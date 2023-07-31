import {Component, OnInit} from '@angular/core';
import {
  CaProjectAncestorType,
  CaProjectLevelStatus,
  CaProjectTreeDto
} from '../../../../../ca-core/model/entities/project/ca-project.class';
import {FlFlatTreeControl} from '@monorepo/front-core-lib';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {ActivatedRoute} from '@angular/router';

interface CaFlatNode {
  id: string;
  name: string;
  level: number;
  expandable: boolean;
  isSelected: boolean;
  levelStatus: CaProjectLevelStatus;
  type: CaProjectAncestorType;
}

@Component({
  selector: 'ca-project-tree-page',
  templateUrl: './ca-project-tree-page.component.html',
  styleUrls: ['./ca-project-tree-page.component.scss'],
})
export class CaProjectTreePageComponent implements OnInit {

  rootProject: CaProjectTreeDto;
  treeControl: FlFlatTreeControl<CaFlatNode, string>;
  dataSource: MatTreeFlatDataSource<CaProjectTreeDto, CaFlatNode>;

  isLoading: boolean = false;


  private _transformer = (node: CaProjectTreeDto, level: number): CaFlatNode => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      level: level,
      name: node.code,
      isSelected: false,
      levelStatus: node.levelStatus,
      type: 'project'
    };
  };

  hasChild = (_: number, node: CaFlatNode): boolean => node.expandable;


  constructor(private projectService: CaProjectService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe(params => {
      this.init(params['projectId']);
    });
  }

  private init(projectId: string): void {
    this.isLoading = true;
    this.projectService.getProjectTree('project', projectId).subscribe({
      next: projectTree => this.constructTree(projectTree),
      error: () => this.isLoading = false
    });
  }


  private constructTree(projectTree: CaProjectTreeDto): void {
    this.rootProject = projectTree;
    this.treeControl = new FlFlatTreeControl<CaFlatNode, string>(
      node => node.level, node => node.expandable, {
        trackBy: node => node.id
      });

    // object to flatten tree
    const treeFlattener: MatTreeFlattener<CaProjectTreeDto, CaFlatNode, string> = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable,
      node => node.children);

    // create the datasource and set data
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener, projectTree.children);

    this.isLoading = false;
  }

}
