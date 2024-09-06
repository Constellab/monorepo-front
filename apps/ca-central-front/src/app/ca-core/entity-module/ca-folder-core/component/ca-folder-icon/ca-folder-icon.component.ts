import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { CaFolderObjectType } from '../../../../model/entities/project/ca-folder.class';
import { FlFileHelper, getFileIconFromExtension } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-folder-icon',
  templateUrl: './ca-folder-icon.component.html',
  styleUrl: './ca-folder-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaFolderIconComponent {

  objectType = input.required<CaFolderObjectType>();

  folderName = input.required<string>();

  size = input<'medium' | 'small'>('medium');

  icon: Signal<string> = computed(() => {
    switch (this.objectType()) {
      // for document, we retrieve the icon from file extension
      case CaFolderObjectType.DOCUMENT:
        const extension = FlFileHelper.getFileExtension(this.folderName());
        return getFileIconFromExtension(extension);
      case CaFolderObjectType.FOLDER:
        return 'folder';
      case CaFolderObjectType.CONSTELLAB_DOCUMENT:
        return 'constellab_document';
      case CaFolderObjectType.REPORT:
        return 'report';
      case CaFolderObjectType.EXPERIMENT:
        return 'experiment';
    }
  });

  iconClasses: Signal<string[]> = computed(() => {
    const classes: string[] = [];
    if (this.size() === 'small') {
      classes.push('g-icon-small');
    }
    const objectType = this.objectType();
    if (objectType === CaFolderObjectType.FOLDER) {
      classes.push('g-icon-background', 'g-accent-background');
    } else if (objectType === CaFolderObjectType.EXPERIMENT) {
      classes.push('g-icon-background', 'g-warn-background');
    } else if (objectType === CaFolderObjectType.REPORT) {
      classes.push('g-icon-background', 'g-primary-background');
    }
    return classes;
  });
}
