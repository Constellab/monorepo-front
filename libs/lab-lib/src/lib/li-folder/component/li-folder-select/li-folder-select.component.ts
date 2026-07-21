import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
} from '@angular/material/tree';
import { ClHelpService } from '@monorepo/core-lib';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlFlatTreeControl, FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import {
  LiConfig,
  LiFolder,
  LiFolderService,
  LiFolderWithChildren,
  LiSystemService,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

interface LabFolderFlatNode {
  folder: LiFolder;
  level: number;
  expandable: boolean;
  selected: boolean;
}

@Component({
  selector: 'li-folder-select',
  templateUrl: './li-folder-select.component.html',
  styleUrls: ['./li-folder-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class LiFolderSelectComponent
  extends FlFormFieldDirective<FlFlatTreeControl<LabFolderFlatNode, string>, LiFolder[] | LiFolder>
  implements OnInit
{
  private folderService = inject(LiFolderService);
  private systemService = inject(LiSystemService);
  private liConfig = inject(LiConfig);

  /**
   * If true, the user can select multiple folders
   * If false, the user can select only one folder
   */
  @Input() multiple: boolean = true;

  @Output() selectionChange: EventEmitter<LiFolder[] | LiFolder> = new EventEmitter();

  dataSource: MatTreeFlatDataSource<LiFolderWithChildren, LabFolderFlatNode>;

  isLoading: boolean = false;

  // handle empty folder list
  isEmpty: boolean = false;
  labDashboardRoute: string; // link to the lab dashboard to add folder to the lab

  // use to store the selected folder before the folder list is loaded
  private tempSelectedFolders: LiFolder[] = [];

  private _transformer = (node: LiFolderWithChildren, level: number): LabFolderFlatNode => {
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

  private getFolderTreesSuccess(folders: LiFolderWithChildren[]): void {
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
    const treeFlattener: MatTreeFlattener<LiFolderWithChildren, LabFolderFlatNode, string> =
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
      this.labDashboardRoute = this.liConfig.getSpaceDashboardLabUrl(systemInfo.lab.labId);
      this.isEmpty = true;
    });
  }

  callChangeEvent(value: LiFolder[] | LiFolder): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: LiFolder[] | LiFolder): void {
    const folders: LiFolder[] = ClHelpService.convertObjectOrArrayToArray(obj);
    this.selectFolders(folders);
  }

  private selectFolders(folders: LiFolder[]): void {
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
  ): LiFolder[] | LiFolder {
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
