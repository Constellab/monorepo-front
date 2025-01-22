import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlFlatTreeControl, FlFormFieldDirective } from '@monorepo/front-core-lib';
import { LabFolder, LabFolderWithChildren } from '../../../../model/entities/lab-folder.class';
import { NgControl } from '@angular/forms';
import { LabFolderService } from '../../../../entity-service/lab-folder.service';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTree,
  MatTreeNodeDef,
  MatTreeNode,
  MatTreeNodePadding,
} from '@angular/material/tree';
import { ClHelpService } from '@monorepo/core-lib';
import { LabSystemService } from '../../../../service/lab-system.service';
import { LabEnvironmentHelper } from '../../../../utils/lab-environment.helper';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { NgClass } from '@angular/common';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-color/fl-color.module';

interface LabFolderFlatNode {
  folder: LabFolder;
  level: number;
  expandable: boolean;
  selected: boolean;
}

@Component({
  selector: 'lab-folder-select',
  templateUrl: './lab-folder-select.component.html',
  styleUrls: ['./lab-folder-select.component.scss'],
  imports: [
    FlSectionModule,
    MatTree,
    MatTreeNodeDef,
    MatTreeNode,
    MatTreeNodePadding,
    NgClass,
    FlCoreDirectiveModule,
    MatIcon,
    TranslatePipe,
    FlColorModule,
  ],
})
export class LabFolderSelectComponent
  extends FlFormFieldDirective<FlFlatTreeControl<LabFolderFlatNode, string>, LabFolder[] | LabFolder>
  implements OnInit
{
  private folderService = inject(LabFolderService);
  private systemService = inject(LabSystemService);

  /**
   * If true, the user can select multiple folders
   * If false, the user can select only one folder
   */
  @Input() multiple: boolean = true;

  @Output() selectionChange: EventEmitter<LabFolder[] | LabFolder> = new EventEmitter();

  dataSource: MatTreeFlatDataSource<LabFolderWithChildren, LabFolderFlatNode>;

  isLoading: boolean = false;

  // handle empty folder list
  isEmpty: boolean = false;
  labDashboardRoute: string; // link to the lab dashboard to add folder to the lab

  // use to store the selected folder before the folder list is loaded
  private tempSelectedFolders: LabFolder[] = [];

  private _transformer = (node: LabFolderWithChildren, level: number): LabFolderFlatNode => {
    return {
      folder: node,
      expandable: node.children?.length > 0,
      level: level,
      selected: false,
    };
  };

  hasChild = (_: number, node: LabFolderFlatNode): boolean => node.expandable;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.folderService.getFolderTrees().subscribe({
      next: (folders) => this.getFolderTreesSuccess(folders),
      error: () => (this.isLoading = false),
    });
  }

  private getFolderTreesSuccess(folders: LabFolderWithChildren[]): void {
    if (folders.length === 0) {
      this.handleEmptyFolderList();
    }

    this.value = new FlFlatTreeControl<LabFolderFlatNode, string>(
      (node) => node.level,
      (node) => node.expandable,
      {
        trackBy: (node) => node.folder.id,
      }
    );

    // object to flatten tree
    const treeFlattener: MatTreeFlattener<LabFolderWithChildren, LabFolderFlatNode, string> =
      new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children
      );

    // create the datasource and set data
    this.dataSource = new MatTreeFlatDataSource(this.value, treeFlattener, folders);

    if (this.tempSelectedFolders?.length > 0) {
      this.selectFolders(this.tempSelectedFolders);
    }

    this.isLoading = false;
  }

  private handleEmptyFolderList(): void {
    this.systemService.getSystemInfo().subscribe((systemInfo) => {
      this.labDashboardRoute = LabEnvironmentHelper.getSpaceDashboardLabUrl(systemInfo.id);
      this.isEmpty = true;
    });
  }

  callChangeEvent(value: LabFolder[] | LabFolder): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: LabFolder[] | LabFolder): void {
    const folders: LabFolder[] = ClHelpService.convertObjectOrArrayToArray(obj);
    this.selectFolders(folders);
  }

  private selectFolders(folders: LabFolder[]): void {
    if (this.value) {
      for (const node of this.value.dataNodes) {
        if (folders.find((folder) => folder.id === node.folder.id) != null) {
          node.selected = true;
          this.value.expandAncestors(node);
        } else {
          node.selected = false;
        }
      }
    }
    this.tempSelectedFolders = folders;
  }

  protected convertInnerToOuter(
    innerValue: FlFlatTreeControl<LabFolderFlatNode, string>
  ): LabFolder[] | LabFolder {
    const folders = innerValue.dataNodes.filter((node) => node.selected).map((node) => node.folder);
    if (!this.multiple) {
      return folders.length > 0 ? folders[0] : null;
    }
    return folders;
  }

  toggleFolderSelection(folder: LabFolderFlatNode): void {
    if (this.disabled) return;

    folder.selected = !folder.selected;

    if (!this.multiple) {
      this.value.dataNodes
        .filter((node) => node.selected && node !== folder)
        .forEach((node) => (node.selected = false));
    }
    this.emitCurrentValue();
  }

  toggleExpandFolderButton(node: LabFolderFlatNode, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.toggleExpandFolder(node);
  }

  toggleExpandFolder(node: LabFolderFlatNode): void {
    this.value.toggle(node);
  }
}
